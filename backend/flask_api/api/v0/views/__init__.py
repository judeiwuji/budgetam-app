#!/usr/bin/python3
""" Blueprint for API """
from flask import Blueprint

app_views = Blueprint('app_views', __name__, url_prefix='/api/v0')

# from api.v0.views.index import *
from api.v0.views.categories import *
