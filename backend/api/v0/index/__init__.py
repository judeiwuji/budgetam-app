from flask import Blueprint


index_views = Blueprint('index_views', __name__)

from api.v0.index.index import *