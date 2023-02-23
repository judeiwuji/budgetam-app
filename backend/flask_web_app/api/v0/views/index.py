from api.v0.views import app_views
from flask import jsonify

@app_views.route('/', methods=['GET'], strict_slashes=False)
def root():
    return jsonify({"message": "welcome to the api view of budgetam"})