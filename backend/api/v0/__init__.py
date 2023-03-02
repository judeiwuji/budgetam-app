def create_app(test_config=None):
    # create and configure the app
    from flask import Flask
    from api.v0.config import Config

    app = Flask(__name__, instance_relative_config=True)
    if not test_config:
        app.config.from_object(Config)
    else:
        app.config.from_object(test_config)
    
    # Register blueprints here
    from api.v0.index import index_views
    from api.v0.views import app_views
    app.register_blueprint(index_views, url_prefix='/')
    app.register_blueprint(app_views, url_prefix='/api')
    
    from flasgger import Swagger
    from flask_mail import Mail
    from flask_cors import CORS
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.config['MAIL'] = Mail(app)
    swag = Swagger(app)
    
    return app
