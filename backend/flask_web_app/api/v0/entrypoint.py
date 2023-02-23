#!/usr/bin/python3
""" Flask Application """
from models import storage
from flask import Flask
from os import environ
from flask_cors import CORS
from flasgger import Swagger
from api.v0.views import app_views
from api.v0.index import index_views


# app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
# app.config['SECRET_KEY'] = environ.get('SECRET_KEY')


# cors = CORS(app, resources={r"/*": {"origins": "*"}})

# @app.teardown_appcontext
# def close_db(error):
#     """ Close Storage """
#     storage.close()

# app.config['SWAGGER'] = {
#     'title': 'Budgetam API Backend Infrastructure',
#     'uiversion': '0.1.0'
# }

# Swagger(app)

def create_flask_app(config_filename):
    app = Flask("Budgetam API")
    app.config.from_pyfile(config_filename)

    app.register_blueprint(index_views)
    app.register_blueprint(app_views)

    return app

def main():
    """ Main Function """
    
    host = environ.get('API_HOST')
    port = environ.get('API_PORT')
    if not host:
        host = '0.0.0.0'
    if not port:
        port = '5000'
    create_flask_app('config.py').run(host=host, port=port, threaded=True)

if __name__ == "__main__":
    main()