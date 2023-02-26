#!/usr/bin/python3
""" Flask Application """
from models import storage
from os import environ, path
from flasgger import Swagger
from api.v0.index import index_views
from api.v0.views import app_views
from flask_cors import CORS

def create_flask_app(config):
    from flask import Flask

    app = Flask(__name__)
    app.config.from_pyfile(config)
    app.config['ROOT_PATH'] = app.root_path
    # app.config['UPLOAD_FOLDER'] = path.join(app.root_path, 'media')

# cors = CORS(app, resources={r"/*": {"origins": "*"}})
    Swagger(app)
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
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
