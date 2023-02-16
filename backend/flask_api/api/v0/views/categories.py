#!/usr/bin/python3
"""handles all request to the category"""
from flask import abort, jsonify, make_response
from models.categories import Categories
from flasgger.utils import swag_from
from models import storage
from api.v0.views import app_views


@app_views.route('/categories', methods=['GET'], strict_slashes=False)
# @swag_from('documentation/amenity/all_amenities.yml')
def get_categories():
    """Retrieves the list of all Categories object"""
    all_categories = storage.all(Categories).values()
    return jsonify([category.to_dict() for category in all_categories])

@app_views.route('/categories/<category_id>', methods=['GET'], strict_slashes=False)
def get_category(category_id):
    """Fetch a single categories record."""

    category = storage.get(Categories, category_id)
    return (jsonify(category.to_dict()) if category else abort(404))

@app_views.route('/categories/<category_id>', methods=['DELETE'], strict_slashes=False)
def delete_category(category_id):
    """Delete a single categories record"""
    
    category = storage.get(Categories, category_id)
    if not category:
        abort(404)
    storage.delete(category)
    storage.save()
    return make_response(jsonify({}), 200)