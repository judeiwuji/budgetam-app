#!/usr/bin/python3
""" Flask Application """
from models import storage
from os import environ
from flasgger import Swagger
from api.v0.index import index_views
from api.v0.views import app_views


# app.config['SWAGGER'] = {
#     'title': 'Budgetam API Backend Infrastructure',
#     'uiversion': '0.1.0'
# }

def create_flask_app(config):
    from flask import Flask

    app = Flask(__name__)
    app.config.from_pyfile(config)

# cors = CORS(app, resources={r"/*": {"origins": "*"}})
    swagger = Swagger(app)

    app.register_blueprint(index_views, url_prefix='/')
    app.register_blueprint(app_views, url_prefix='/api')
    return app


if __name__ == '__main__':
    host = environ.get('API_HOST')
    port = environ.get('API_PORT')
    app = create_flask_app('config.py')
    app.run(
        debug=True,
        host=(host if host else '0.0.0.0'),
        port=(port if port else '5000'), 
        threaded=True)
    storage.close()
