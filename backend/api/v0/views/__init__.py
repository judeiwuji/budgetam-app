#!/usr/bin/python3
""" Blueprint for API """
from flask import Blueprint, current_app

app_views = Blueprint('app_views', __name__)
query_params = ['filter', 'sort']

def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']

from api.v0.views.index import *
from api.v0.views.categories import *
from api.v0.views.users import *
from api.v0.views.transactions import *
