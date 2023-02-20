from functools import wraps
from flask import jsonify, request
from jwt import decode, encode
from api.v0 import app
from api.v0.views import time
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
            return jsonify({'message' : 'Token is missing !!'}), 401
    
        # jwt is passed in the request header
        token = request.headers['Authorization']
        if not token:
            return jsonify({'message' : 'token is invalid !!'}), 401
        user_data = storage.get_param(Users, **{'token': token})
        if not user_data:
            return jsonify({'message': 'user does not exist or token incorrect'}), 401
            
        return  f(user_data, *args, **kwargs)
  
    return decorated