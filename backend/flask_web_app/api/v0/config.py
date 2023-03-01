from os import environ

import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = "zSO$$FiT26!2GvcVGUGga9*#p16Rp9L4*p9v3vYDdyVgdApaqh"
    DEBUG = False
    UPLOAD_FOLDER = '/static/media'
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    MAIL_SERVER = 'sandbox.smtp.mailtrap.io'
    MAIL_PORT = 2525
    MAIL_USERNAME = '6e147f179cf94f'
    MAIL_PASSWORD = '51f04cec61695e'
    MAIL_USE_SSL = False
    MAIL_DEFAULT_SENDER = ('admin', 'admin@budgetam.tech')
    SERVER_NAME = '127.0.0.1:5002'
    SWAGGER = {
        'title': 'Budgetam API Backend Infrastructure',
        'uiversion': 3,
        'openapi': '3.0.0',
        'components': {
            'securitySchemes': {
                'bearerAuth':            # arbitrary name for the security scheme
                {'type': 'http',
                 'scheme': 'bearer',
                 'bearerFormat': 'JWT'}
            }
        }    # optional, arbitrary value for documentation purposes
    }


class ConfigTests:
    SECRET_KEY = "zSO$$FiT26!2GvcVGUGga9*#p16Rp9L4*p9v3vYDdyVgdApaqh"
    DEBUG = False
    TYPE_STORAGE = 'db'
