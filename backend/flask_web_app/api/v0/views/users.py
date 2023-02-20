#!/usr/bin/python3
"""handles all request to the user"""
from flask import jsonify, request
from api.v0 import app
from api.v0.views import app_views, time
from api.v0.auth.token_required import token_required
from models.users import Users
from werkzeug.security import check_password_hash, generate_password_hash
from models import storage
from email_validator import validate_email, EmailNotValidError
from jwt import encode, decode
from datetime import datetime, timedelta
from flasgger.utils import swag_from


@app_views.route('/signup', methods=['GET', 'POST', 'PUT'], strict_slashes=False)
@swag_from('documentation/users/signup.yml')
def signup():
    """For signing up a user"""
    if request.method != 'PUT':
        return jsonify({"accepts": {
            "username": "required",
            "email": "required",
            "password": "required"
        }})
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "not a json"}), 401
    if len(data) != 3:
        return jsonify({"error": "data incomplete"}), 401
    username, email, password = data.get('username'), data.get(
        'email'), data.get('password')

    # check the email to ensure it's validated
    try:
        validation = validate_email(email)
        email = validation.email
    except EmailNotValidError:
        return jsonify({"error": "email not valid"}), 401

    # gets all the users to check for someone who has already signed up
    username_check = storage.get_param(Users, **{'username': username})
    email_check = storage.get_param(Users, **{'email': email})
    if username_check or email_check:
        return jsonify({"error": "the username or email has been used before"}), 401
    instance = Users(**{
        "username": username,
        "email": email,
        "password": generate_password_hash(password)
    })
    instance.save()
    # ret_dict = instance.to_dict().pop('password')
    return jsonify({"message": "user created successful"}), 201     # created


@app_views.route('/login', methods=['GET', 'POST'], strict_slashes=False)
def login():
    """For logging in a user"""
    if request.method == 'GET':
        return jsonify({"accepts": {
            "username": "required",
            "password": "required"
        }})
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "not a json"}), 401
    if len(data) != 2:
        return jsonify({"error": "data incomplete"}), 401
    username, password = data.get('username'), data.get('password')

    if not username or not password:
        return jsonify({"error": "sorry couldn't handle that, check data."})

    user_data = storage.get_param(Users, **{'username': username})
    if not user_data:
        return jsonify({"error": "sorry you need to create an account"}), 401
    
    if not check_password_hash(user_data.password, password):
        return jsonify({"error": "sorry your password is not correct"})

    expires = datetime.utcnow() - timedelta(minutes=20)
    user_token = user_data.token
    if user_token:
        expires = datetime.strptime(decode(user_token, app.secret_key, algorithms="HS256")['expireAt'], time)
    
    if not user_token or expires < datetime.utcnow():         # token expired

        expires = datetime.utcnow() + timedelta(minutes=20)
        user_data.token = encode({
            'username': username,
            'expireAt': datetime.strftime(expires, time)
        }, app.secret_key)
        user_data.save()

    return jsonify({"token": user_data.token, "expiresAt": str(expires)}), 201


@app_views.route('/logout', methods=['GET', 'POST'], strict_slashes=False)
@token_required
def logout(user_data):
    """for loging out a user"""
    user_data.token = None
    user_data.save()
    return jsonify({'message': 'successfully logged out'}), 201

@app_views.route('/refresh', methods=['GET', 'POST'], strict_slashes=False)
@token_required
def refresh(user_data):
    """for refreshing the tokens"""
    token = decode(user_data.token, app.secret_key, algorithms="HS256")
    expires = datetime.strptime(token['expireAt'], time)
    if expires <= datetime.utcnow():         # token expired
        expires = datetime.utcnow() + timedelta(minutes=20)
        user_data.token = encode({
            'username': token['username'],
            'expireAt': datetime.strftime(expires, time)
        }, app.secret_key)
        user_data.save()
    return jsonify({"token": user_data.token, "expiresAt": str(expires)}), 201
