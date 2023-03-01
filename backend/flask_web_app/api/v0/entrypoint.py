#!/usr/bin/python3
""" Flask Application """
from models import storage
from os import environ
from api.v0 import create_app
from flask import render_template

app = create_app()


@app.route('/', methods=['GET'], strict_slashes=False)
def root():
    """Index of API"""
    return render_template('index.html')


@app.teardown_appcontext
def close_db(error):
    """ Close Storage """
    storage.close()


@app.errorhandler(404)
def not_found(error):
    """ 404 Error
    ---
    responses:
      404:
        description: a resource was not found
    """
    return render_template('index.html')


host = environ.get('API_HOST')
port = environ.get('API_PORT')
app.run(
    debug=True,
    host=(host if host else '0.0.0.0'),
    port=(port if port else '6000'),
    threaded=True)
storage.close()
