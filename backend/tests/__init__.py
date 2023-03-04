from api.v0 import create_app
from api.v0.config import ConfigTests

flask_app = create_app(ConfigTests)
