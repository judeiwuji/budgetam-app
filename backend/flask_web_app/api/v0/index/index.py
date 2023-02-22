#!/usr/bin/python3
""" Index """
from api.v0.index import index_views
from flask import jsonify

@index_views.route('/', methods=['GET'], strict_slashes=False)
def root():
    """Index of API"""
    return jsonify({"message": "welcome home"})

@index_views.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """ Status of API """
    return jsonify({"status": "OK"})