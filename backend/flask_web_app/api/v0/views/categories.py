#!/usr/bin/python3
"""handles all request to the category"""
from flask import jsonify, request
from api.v0.auth.token_required import token_required
from models.categories import Categories
from flasgger.utils import swag_from
from models import storage
from api.v0.views import app_views, query_params
from math import ceil


def sub_create_update(data):
    if not data:
        return jsonify({"error": "sorry no data passed"}), 401
    if len(data) < 1 or len(data) > 3:
        return jsonify({"error", "sorry the data passed is incomplete"}), 401
    name, icon, is_expense = data.get('name'), \
        data.get('icon'), data.get('isExpense')
    if not name:
        return jsonify({"error": "sorry keyword name not found in the data"}), 401
    if len(name) > 30:
        return jsonify({"error": "sorry the length of name exceeds 30"}), 401
    if icon:
        if len(icon) > 255:
            return jsonify({"error": "sorry the length of icon exceeds 30"}), 401
    if is_expense:
        try:
            is_expense = eval(is_expense)
        except NameError:
            jsonify({"error": "isExpense is not a boolean"}), 401
    return name, icon, is_expense

# @swagger.validate('Product')


@app_views.route('/categories', methods=['GET'], strict_slashes=False)
#   ('documentation/categories/all_categories.yml', methods=['GET'])
def all_categories():
    """"""
   
    # if ?filter=(id='abc')
    args = request.args
    all_data = storage.all(Categories)
    result = []
    page = args.get('page', 1, type=int) - 1
    perPage = args.get('perPage', 10, type=int)
    filter = args.get('filter', None, type=str)
    len_all_data = 0
    if all_data:
        try:
            for iter in range(page*perPage, (page*perPage)+perPage):
                result.append(all_data[iter].to_dict())
        except IndexError:
            pass
        len_all_data = len(result)

    return jsonify({
        "page": page+1,
        "perPage": perPage,
        "totalItems": len_all_data,
        "totalPages": (1 if len_all_data < perPage else ceil(len_all_data/perPage)),
        "items": result
    })


@app_views.route('/categories/<category_id>', methods=['GET'], strict_slashes=False)
def view_category(category_id):
    """Fetch a single categories record."""
    category = storage.get(Categories, category_id)
    if not category:
        return jsonify({'error': 'sorry no category with that id'}), 402
    return jsonify(category.to_dict())


@app_views.route('/categories', methods=['PUT'], strict_slashes=False)
@token_required
def create_category(_):
    """
    file:documentation\categories\all_categories.yml
    """
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
        return jsonify({"error": "sorry the transaction ID is not in the database"}), 401
    try:
        for key, value in {
            "name": name,
            "icon": (icon if icon else instance.icon),
                "isExpense": (is_expense if is_expense else instance.isExpense)}.items():
            setattr(instance, key, value)
        storage.save()
    except:
        return jsonify({"error": "error occured while saving data in database"}), 501
    return jsonify(instance.to_dict()), 201


@app_views.route('/categories/<cat_id>', methods=['DELETE'], strict_slashes=False)
@token_required
def delete_category(*_, **app_views_kwargs):
    try:
        instance = storage.get(Categories, app_views_kwargs['cat_id'])
    except:
        return jsonify({"error": "an error occured while reading the database"}), 500

    if not instance:
        return jsonify({"error": "sorry the category does not exists"}), 401

    try:
        storage.delete(instance)
    except:
        return jsonify({"error": "an error occured while deleting from the database"}), 500
    return jsonify({}), 201
