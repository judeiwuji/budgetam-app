#!/usr/bin/python3
""" Index """
from api.v0.views import app_views
from flask import jsonify

@app_views.route('/', method=['GET'], strict_slashes=False)
def _():
    """Index of API"""
    return jsonify({"message: welcome home"})

@app_views.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """ Status of API """
    return jsonify({"status": "OK"})