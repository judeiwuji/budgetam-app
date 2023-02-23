#!/usr/bin/python3
""" Blueprint for API """
from flask import Blueprint

app_views = Blueprint('app_views', __name__)
query_params = ['filter', 'sort']

from api.v0.views.index import *
from api.v0.views.categories import *
from api.v0.views.users import *
from api.v0.views.transactions import *