#!/usr/bin/python3
"""handles all request to the transactions"""
from uuid import UUID
from flask import jsonify, request
from models import storage
from api.v0.auth.token_required import token_required
from api.v0.views import app_views, query_params
from models.categories import Categories
from models.users import Users
from models.transactions import Transactions
from flasgger.utils import swag_from
from math import ceil


def sub_delete_update(data: dict, transac_id: str, username: str):

    # check if data was sent through json
    if not data:
        return jsonify({"error": "not a json"}), 401
    if len(data) < 3 or len(data) > 5:
        return jsonify({"error": "data incomplete"}), 401

     # check if the transaction id is of uuid
    try:
        if UUID(transac_id).version != 4:
            raise ValueError
    except ValueError:
        return jsonify({"error": "something wrong with the transaction ID"}), 401

    # check if the transaction id is in database
    if transac_id == "":
        try:
            transac_obj = storage.get(Transactions, transac_id)
        except:
            return jsonify({"error": "an error occured while reading the database"}), 500
        if not transac_obj:
            return jsonify({"error": "sorry the transaction ID is not in the database"}), 401

    title, catId, userId, amount, note = data.get("title"), data.get("catId"), \
        data.get("userId"), data.get("amount"), data.get("note")

    # check for optional and required
    if not title:
        return jsonify({"error": "sorry the title not found in the json"}), 401
    if not catId:
        return jsonify({"error": "sorry the category ID not found in the json"}), 401
    if not userId:
        return jsonify({"error": "sorry the user ID not found in the json"}), 401
    if not amount:
        amount = None
    if not note:
        note = None

    # checks if the user is trying to edit his record
    if not username == userId:
        return jsonify({"error": "sorry you can create only your transaction"}), 401

    # tests the category ID if it matches a UUID
    try:
        if UUID(catId).version != 4:
            raise ValueError
    except ValueError:
        return jsonify({"error": "something wrong with the category ID"}), 401

    # tests the user ID if it matches a UUID
    try:
        if UUID(userId).version != 4:
            raise ValueError
    except ValueError:
        return jsonify({"error": "something wrong with the user ID"}), 401

    # check if the category ID is in database
    if not storage.get(Categories, catId):
        return jsonify({"error": "sorry the category ID is not in the database"}), 401

    # check if the user ID is in database
    if not storage.get(Users, catId):
        return jsonify({"error": "sorry the user ID is not in the database"}), 401

    # check if the amount is an integer
    if amount:
        try:
            amount = int(amount)
        except ValueError:
            return jsonify({"error": "sorry the amount is not an integer"}), 402

    # check if the title is more than 50 characters
    if len(title) > 50:
        return jsonify({"error": "sorry the title is greater than 50 characters"}), 402

    return title, catId, userId, amount, note, transac_obj


@app_views.route('/transactions', methods=['GET'], strict_slashes=False)
@swag_from('documentation/users/all_transactions.yml', methods=['GET'])
@token_required
def all_transactions(user_data):
    args = request.args
    all_data = storage.filter(Transactions, **{'username': user_data.username})
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


@app_views.route('/transactions/<transac_id>', methods=['GET'], strict_slashes=False)
@swag_from('documentation/users/view_transactions.yml', methods=['GET'])
@token_required
def view_transaction(*user_data, **app_views_kwargs):
    """Retrieves the transaction of a given id"""
    args = request.args
    if not args:
        return jsonify({"error": "error in args"}), 401
    data = storage.get(Transactions, app_views_kwargs['transac_id'])
    if not data:
        return jsonify({"error": "data retrieval failed, please try again"}), 401
    if user_data.username != data.username:
        return jsonify({"error": "you can only access your data"})
    return jsonify(data)


@app_views.route('/transactions', methods=['GET', 'POST'], strict_slashes=False)
@swag_from('documentation/users/create_transaction.yml', methods=['GET'])
@token_required
def create_transaction(token_user_obj):
    """Creates a new transaction"""

    result_sub = sub_delete_update(
        request.get_json(silent=True),
        "",
        token_user_obj.to_dict()['username'])
    if len(result_sub) == 2:
        return result_sub

    title, catId, userId, amount, note, _ = result_sub

    transac_data = Transactions(**{
        "title": title,
        "catId": catId,
        "userId": userId,
        "amount": amount,
        "note": note
    })
    transac_data.save()
    return jsonify({"message": transac_data.to_dict()}), 201     # created


@app_views.route('/transactions/<transac_id>', methods=['PATCH'], strict_slashes=False)
@swag_from('documentation/users/update_transaction.yml', methods=['GET'])
@token_required
def update_transaction(token_user_obj, transac_id):
    """Creates a new transaction"""

    result_sub = sub_delete_update(
        request.get_json(silent=True),
        transac_id,
        token_user_obj.to_dict()['username'])
    if len(result_sub) == 2:
        return result_sub

    title, catId, userId, amount, note, transac_obj = result_sub

    transac_data = transac_obj(**{
        "title": title,
        "catId": catId,
        "userId": userId,
        "amount": amount,
        "note": note
    })
    transac_data.save()
    return jsonify({"message": transac_data.to_dict()}), 201     # created


@app_views.route('/transactions/<transac_id>', methods=['DELETE'], strict_slashes=False)
@swag_from('documentation/users/delete_transactions.yml', methods=['GET'])
@token_required
def delete_transaction(token_user_obj, transac_id):
    """deletes a transaction"""

    result_sub = sub_delete_update(
        request.get_json(silent=True),
        transac_id,
        token_user_obj.to_dict()['username'])
    if len(result_sub) == 2:
        return result_sub
    _, _, _, _, _, transac_obj = sub_delete_update

    storage.delete(transac_obj)
    return jsonify({}), 201


@app_views.route('/balance', methods=['GET'], strict_slashes=False)
@swag_from('documentation/users/get_balance.yml', methods=['GET'])
@token_required
def get_balance(token_object):
    pass
    username = token_object.username

    # check if the transaction id is of uuid

    transac_obj = storage.get_param(Transactions, **{'username': username})
    if transac_obj:
        transac_list, expenses, income = [item.to_dict() for item in transac_obj], 0, 0
        for item in transac_list:
            if item['isExpense'] == 'false':
                expenses += item['amount']
            if item['isExpense'] == 'true':
                income += item['amount']
        return jsonify({
            'expenses':expenses,
            'income': income
        })
