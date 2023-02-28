#!/usr/bin/python3
"""handles all request to the user"""
from flask import current_app, flash, jsonify, redirect, request, url_for
from api.v0.views import app_views, allowed_file
from api import time
from api.v0.auth.token_required import token_required
from models.users import Users
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from models import storage
from email_validator import validate_email, EmailNotValidError
from jwt import encode, decode
from datetime import datetime, timedelta
from flasgger.utils import swag_from
from os import path, getcwd, makedirs


@app_views.route('/signup', methods=['POST'], strict_slashes=False)
@swag_from('documentation/users/signup.yml')
def signup():
    """For signing up a user"""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "not a json"}), 400
    if len(data) != 3:
        return jsonify({"error": "data incomplete"}), 400
    username, email, password = data.get('username'), data.get(
        'email'), data.get('password')
    
    if not username or not password:
        return jsonify({"error": "sorry could not handle that, check data."}), 401

    # check the email to ensure it's validated
    try:
        validation = validate_email(email)
        email = validation.email
    except EmailNotValidError:
        return jsonify({"error": "email not valid"}), 400

    # gets all the users to check for someone who has already signed up
    # username_check = storage.get_param(Users, **{'username': username})
    email_check = storage.get_param(Users, **{'email': email})
    if email_check:
        return jsonify({"error": "email has been used before"}), 400
    instance = Users(**{
        "username": username,
        "email": email,
        "password": generate_password_hash(password)
    })
    instance.save()
    # ret_dict = instance.to_dict().pop('password')
    return jsonify({"message": "user created successful"}), 201     # created


@app_views.route('/login', methods=['POST'], strict_slashes=False)
@swag_from('documentation/users/login.yml', methods=['GET'])
def login():
    """For logging in a user"""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "not a json"}), 401
    if len(data) != 2:
        return jsonify({"error": "data incomplete"}), 401
    email, password = data.get('email'), data.get('password')

    if not email or not password:
        return jsonify({"error": "sorry couldn't handle that, check data."})

    user_data = storage.get_param(Users, **{'email': email})
    if not user_data:
        return jsonify({"error": "sorry you need to create an account"}), 401

    if not check_password_hash(user_data.password, password):
        return jsonify({"error": "sorry your password is not correct"}), 401

    expires = datetime.utcnow() - timedelta(minutes=20)
    user_token = user_data.token
    if user_token:
        expires = datetime.strptime(decode(
            user_token, current_app.config['SECRET_KEY'], algorithms="HS256")['expireAt'], time)

    if not user_token or expires < datetime.utcnow():         # token expired

        expires = datetime.utcnow() + timedelta(hours=24)
        user_data.token = encode({
            'id': user_data.id,
            'expireAt': datetime.strftime(expires, time)
        }, current_app.config['SECRET_KEY'])
        user_data.save()

    return jsonify({"token": user_data.token, "expiresAt": str(expires)}), 200

@app_views.route('/profile', methods=['GET'], strict_slashes=False)
# @swag_from('documentation/users/profile.yml', methods=['GET'])  
@token_required
def profile(user_data):
    """the profile of the user"""
    return jsonify(user_data.to_dict())

@app_views.route('/logout', methods=['GET'], strict_slashes=False)
# @swag_from('documentation/users/logout.yml', methods=['GET'])  
@token_required
def logout(user_data):
    """for loging out a user"""

    user_data.token = None
    user_data.save()
    return jsonify({'message': 'successfully logged out'}), 200


@app_views.route('/refresh', methods=['GET', 'POST'], strict_slashes=False)
@token_required
def refresh(user_data):
    """for refreshing the tokens"""
    token = decode(user_data.token,
                   current_app.config['SECRET_KEY'], algorithms="HS256")
    expires = datetime.strptime(token['expireAt'], time)
    if expires <= datetime.utcnow():         # token expired
        expires = datetime.utcnow() + timedelta(minutes=20)
        user_data.token = encode({
            'id': token['id'],
            'expireAt': datetime.strftime(expires, time)
        }, current_app.config['SECRET_KEY'])
        user_data.save()
    return jsonify({"token": user_data.token, "expiresAt": str(expires)}), 201

@app_views.route('/delete_user', methods=['DELETE'], strict_slashes=True)
@token_required
def delete_user(user_data):
    """for deleting a user"""
    try:
        user_data.deleted = datetime.utcnow()
    except:
        return jsonify({"error": "an error occured while deleting from the database"}), 500
    return jsonify({}), 201

@app_views.route('/avatar', methods=['POST'], strict_slashes=True)
@token_required
def upload_file(user_data):
    # check if the post request has the file part
    if 'avatar' not in request.files:
        return jsonify({"error": "please upload a file"}), 400
    file = request.files['avatar']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        return jsonify({"error": "please try uploading a file with correct filename"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)

        static_path = path.join(
            current_app.config['UPLOAD_FOLDER'],
            user_data.username)
        
        file_path = path.join(
            current_app.config['ROOT_PATH'], static_path,
            )
        
        if not path.exists(file_path):
            makedirs(file_path, mode=777, exist_ok=True)
        file_path = path.join(file_path, filename)
        file.save(file_path)
        user_data.avatar = path.join( static_path, filename).replace('\\', '/')
        user_data.save()
        return jsonify({"image": user_data.avatar})    


# @app_views.route('/avatar', methods=['POST'], strict_slashes=False)
# @token_required
# def avatar(user_data):
#     """uploading personal avatar"""
#     if request.method == 'POST':
#         if 'file' not in request.files:
#             flash('No file part')
#             return jsonify({"error": "please upload a file"}), 400
#         file = request.files['file']
#         if file.filename == '':
#             flash('No selected file')
#             return jsonify({"error": "please try uploading a file with correct filename"}), 400
#         if file and allowed_file(file.filename):
#             filename = secure_filename(file.filename)
#             file.save(path.join(getcwd(), f"/avatar/{user_data.username}", filename))
#             user_data(**{'avatar': file.filename}).save()
#             return jsonify({"message": url_for('download_file', name=filename)})
        
#     return jsonify({'message': 'allowed method is POST'}), 400