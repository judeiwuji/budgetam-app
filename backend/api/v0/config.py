class Config:
    from os import getcwd, path

    SECRET_KEY = "zSO$$FiT26!2GvcVGUGga9*#p16Rp9L4*p9v3vYDdyVgdApaqh"
    DEBUG = False
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}
    MAIL_SERVER = 'us2.smtp.mailhostbox.com'
    MAIL_PORT = 587
    MAIL_USERNAME = 'admin@budgetam.tech'
    MAIL_PASSWORD = 'o^)RTOz6'
    MAIL_USE_SSL = True
    MAIL_DEFAULT_SENDER = ('admin', 'admin@budgetam.tech')
    ROOT_PATH = getcwd()
    UPLOAD_FOLDER = path.join(ROOT_PATH, 'api', 'v0', 'static', 'media')
    # SERVER_NAME = '127.0.0.1:6000'
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
