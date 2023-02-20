#!/usr/bin/python3
""" Flask Application """
from models import storage
from flask import Flask
from os import environ
from flask_cors import CORS
from flasgger import Swagger
from api.v0.views import app_views
from api.v0 import app


# app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
# app.config['SECRET_KEY'] = environ.get('SECRET_KEY')

app.register_blueprint(app_views)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.teardown_appcontext
def close_db(error):
    """ Close Storage """
    storage.close()

app.config['SWAGGER'] = {
    'title': 'Budgetam API Backend Infrastructure',
    'uiversion': '0.1.0'
}

Swagger(app)

if __name__ == "__main__":
    """ Main Function """
    host = environ.get('API_HOST')
    port = environ.get('API_PORT')
    if not host:
        host = '0.0.0.0'
    if not port:
        port = '5000'
    app.run(host=host, port=port, threaded=True)