#!/usr/bin/python3
"""handles all request to the category"""
from flask import jsonify, request
from api.v0.auth.token_required import token_required
from models.categories import Categories
from flasgger.utils import swag_from
from models import storage
from api.v0.views import app_views
from os import path


def sub_create_update(data):
    if not data:
        return jsonify({"error": "not a json"}), 400
    if len(data) < 1 or len(data) > 3:
        return jsonify({"error", "sorry the data passed is incomplete"}), 400
    name, icon, is_expense = data.get('name'), \
        data.get('icon'), data.get('isExpense')
    if not name:
        return jsonify({"error": "sorry keyword name not found in the data"}), 400
    if len(name) > 30:
        return jsonify({"error": "sorry the length of name exceeds 30"}), 400
    if icon:
        if len(icon) > 255:
            return jsonify({"error": "sorry the length of icon exceeds 30"}), 400
    if is_expense:
        try:
            is_expense = eval(is_expense)
        except NameError:
            jsonify({"error": "isExpense is not a boolean"}), 400
    return name, icon, is_expense


@app_views.route('/categories', methods=['GET'], strict_slashes=False)
@swag_from('documentation/categories/all_categories.yml', methods=['GET'])
def all_categories():
    return jsonify(
        [category.to_dict() for category in sorted(storage.all(Categories), key=lambda d: d.name)]
        )


@app_views.route('/categories/<category_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/categories/view_category.yml', methods=['GET'])
def view_category(category_id):
    """Fetch a single categories record."""
    category = storage.get(Categories, category_id)
    if not category:
        return jsonify({'error': 'sorry no category with that id'}), 402
    return jsonify(category.to_dict())


@app_views.route('/categories', methods=['PUT'], strict_slashes=False)
@swag_from(path.join('documentation', 'categories', 'create_category.yml'), methods=['GET'])
@token_required
def create_category(user_obj):
    
    result = sub_create_update(request.get_json(silent=True))
    if len(result) == 2:
        return result
    name, icon, is_expense = result

    try:
        category_data = Categories(**{
            "name": name,
            "icon": icon,
            "isExpense": is_expense
        })
        category_data.save()
    except:
        return jsonify({"error": "error occured while saving data in database"}), 501
    return jsonify(category_data.to_dict()), 201

# returns cat_id


@app_views.route('/categories/<cat_id>', methods=['PATCH'], strict_slashes=False)
@token_required     # returns token object
def update_category(*_, **app_views_kwargs):

    result = sub_create_update(request.get_json(silent=True))
    if len(result) == 2:
        return result
    name, icon, is_expense = result

    try:
        instance = storage.get(Categories, app_views_kwargs['cat_id'])
    except:
        return jsonify({"error": "an error occured while reading the database"}), 500
    if not instance:
        return jsonify({"error": "sorry the transaction ID is not in the database"}), 400
    try:
        for key, value in {
            "name": name,
            "icon": (icon if icon else instance.icon),
            "isExpense": (is_expense if is_expense else instance.isExpense)}.items():
            setattr(instance, key, value)
        storage.save()
    except Exception as error:
        return jsonify({
            "error": "error occured while saving data in database",
            "message": str(error)}), 501
    return jsonify(instance.to_dict()), 201


@app_views.route('/categories/<cat_id>', methods=['DELETE'], strict_slashes=False)
@token_required
def delete_category(*_, **app_views_kwargs):
    try:
        instance = storage.get(Categories, app_views_kwargs['cat_id'])
    except:
        return jsonify({"error": "an error occured while reading the database"}), 500

    if not instance:
        return jsonify({"error": "sorry the category does not exists"}), 400

    try:
        storage.delete(instance)
    except:
        return jsonify({"error": "an error occured while deleting from the database"}), 500
    return jsonify({}), 201
