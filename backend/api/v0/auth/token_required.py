from functools import wraps
from flask import current_app, jsonify, request
from jwt import decode, encode
from api import time
from models import storage
from models.users import Users
from datetime import datetime, timedelta

# decorator for verifying the JWT


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # return 401 if token is not passed
        if not 'Authorization' in request.headers:
            return jsonify({'message': 'Token is missing !!'}), 400

        # jwt is passed in the request header
        token = request.headers['Authorization']
        if not token:
            return jsonify({'message': 'token is invalid !!'}), 400
        user_data = storage.get_param(Users, **{'token': token})
        if not user_data:
            return jsonify({'message': 'user does not exist or token incorrect'}), 400

        expires = decode(token, current_app.config['SECRET_KEY'], algorithms=[
                         "HS256"])['expireAt']
        if datetime.strptime(expires, time) <= datetime.utcnow() and f.__name__ != 'refresh':
            return jsonify({'message': 'sorry your token has expired please refresh it'}), 400
        return f(user_data, *args, **kwargs)

    return decorated
