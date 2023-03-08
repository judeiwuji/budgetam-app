#!/usr/bin/python3
"""handles all request to the transactions"""
from datetime import datetime, timedelta, date
from uuid import UUID
from flask import jsonify, request
from models.transaction_category import TransactionCategory
from models import storage
from api.v0.auth.token_required import token_required
from api.v0.views import app_views, query_params
from models.categories import Categories
from models.users import Users
from models.transactions import Transactions
from flasgger.utils import swag_from
from math import ceil
from calendar import monthrange
from os import path


def sub_delete_update(data: dict, transac_id: str, userId_obj: str):

    # check if data was sent through json
    if not data:
        return jsonify({"error": "not a json"}), 400
    if len(data) < 3:
        return jsonify({"error": "data incomplete"}), 400

     # check if the transaction id is of uuid
    transac_obj = None
    if transac_id:
        try:
            if UUID(transac_id).version != 4:
                raise ValueError
        except ValueError:
            return jsonify({"error": "something wrong with the transaction ID"}), 400

        # check if the transaction id is in database

        transac_obj = storage.get(Transactions, transac_id)
        if not transac_obj:
            return jsonify({"error": "sorry the transaction ID is not in the database"}), 400

    date, catId, userId, amount, note = data.get("date"), data.get("catId"), \
        data.get("userId"), data.get("amount"), data.get("note")

    # check for optional and required
    if not catId:
        return jsonify({"error": "sorry the category ID not found in the json"}), 400
    if transac_id and not userId:
        return jsonify({"error": "sorry the user ID not found in the json"}), 400

    # checks if the user is trying to edit his record
    if transac_id and userId_obj != userId:
        return jsonify({"error": "sorry you can create only your transaction"}), 400

    # tests the category ID if it matches a UUID
    try:
        if UUID(catId).version != 4:
            raise ValueError
    except ValueError:
        return jsonify({"error": "something wrong with the category ID"}), 400

    # tests the user ID if it matches a UUID
    try:
        if transac_id and UUID(userId).version != 4:
            raise ValueError
    except ValueError:
        return jsonify({"error": "something wrong with the user ID"}), 400

    # check if the category ID is in database
    if not storage.get(Categories, catId):
        return jsonify({"error": "sorry the category ID is not in the database"}), 400

    # check if the user ID is in database
    if transac_id and not storage.get(Users, userId):
        return jsonify({"error": "sorry the user ID is not in the database"}), 400

    # check if the amount is an integer
    if amount:
        try:
            amount = float(amount)
        except ValueError:
            return jsonify({"error": "sorry the amount is not an integer"}), 400

    # check if the title is more than 50 characters
    # if len(title) > 50:
    #     return jsonify({"error": "sorry the title is greater than 50 characters"}), 402
    if not userId:
        userId = userId_obj
    return date, catId, userId, amount, note, transac_obj


@app_views.route('/transactions', methods=['GET'], strict_slashes=False)
@swag_from(path.join('documentation', 'transactions', 'all_transactions.yml'))
@token_required
def all_transactions(user_data):

    args = request.args
    all_data = storage.filter(Transactions, **{'userId': user_data.id})
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
# @swag_from('documentation/users/view_transactions.yml', methods=['GET'])
@token_required
def view_transaction(*user_data, **app_views_kwargs):
    """Retrieves the transaction of a given id"""
    args = request.args
    if not args:
        return jsonify({"error": "error in args"}), 400
    data = storage.get(Transactions, app_views_kwargs['transac_id'])
    if not data:
        return jsonify({"error": "data retrieval failed, please try again"}), 400
    if user_data.username != data.username:
        return jsonify({"error": "you can only access your data"}), 401
    return jsonify(data)


@app_views.route('/transactions', methods=['POST'], strict_slashes=False)
# @swag_from('documentation/users/create_transaction.yml', methods=['GET'])
@token_required
def create_transaction(user_data):
    """Creates a new transaction"""
    # from sys import stdout
    # print(user_data, file=stdout)

    result_sub = sub_delete_update(
        request.get_json(silent=True),
        None,
        user_data.id)
    if len(result_sub) == 2:
        return result_sub

    date, catId, userId, amount, note, _ = result_sub
    transac_data = Transactions(**{
        "date": datetime.strptime("{}T00:00:00".format(date), "%Y-%m-%dT%H:%M:%S"),
        "catId": catId,
        "userId": userId,
        "amount": amount,
        "note": note
    })
    transac_data.save()
    transac_data.category  # lazy load category
    return jsonify(transac_data.to_dict()), 201     # created


@app_views.route('/transactions/<transac_id>', methods=['PUT'], strict_slashes=False)
@swag_from('documentation/users/update_transaction.yml', methods=['GET'])
@token_required
def update_transaction(user_data, *_, **app_views_kwargs):
    """Creates a new transaction"""
    transac_id = app_views_kwargs['transac_id']

    result_sub = sub_delete_update(
        request.get_json(silent=True),
        transac_id,
        user_data.id)
    if len(result_sub) == 2:
        return result_sub

    date, catId, userId, amount, note, transac_obj = result_sub
    if not transac_obj:
        return jsonify({"error": "sorry something failed"}), 401
    try:
        for key, value in {
                "date": datetime.strptime("{}T00:00:00".format(date), "%Y-%m-%dT%H:%M:%S"), "catId": catId, "userId": userId,
                "amount": amount, "note": note}.items():
            setattr(transac_obj, key, value)
        storage.save()
    except:
        return jsonify({"error": "error occured while saving data in database"}), 501
    return jsonify({"message": transac_obj.to_dict()}), 201     # created


@app_views.route('/transactions/<transac_id>', methods=['DELETE'], strict_slashes=False)
# @swag_from('documentation/users/delete_transactions.yml', methods=['GET'])
@token_required
def delete_transaction(user_data, *_, **app_views_kwargs):
    """deletes a transaction"""
    transac_id = app_views_kwargs['transac_id']
    transaction = storage.get(Transactions, transac_id)
    if not transaction:
        return jsonify({}), 404
    storage.delete(transaction)
    return jsonify({})


@app_views.route('/balance', methods=['GET'], strict_slashes=False)
# @swag_from('documentation/users/get_balance.yml', methods=['GET'])
@token_required
def get_balance(user_data):
    # from sys import stdout

    expenses = 0
    income = 0
    now = datetime.today()
    month, totalDays = monthrange(now.year, now.month)
    firstDayOfMonth = datetime(year=now.year, month=now.month, day=1)
    lastDayOfMonth = datetime(year=now.year, month=now.month, day=totalDays)
    # retrieve all user transactions for this monthly
    transactions = storage.query(Transactions).\
        filter(Transactions.userId == user_data.id,
               Transactions.date >= firstDayOfMonth,
               Transactions.date <= lastDayOfMonth)

    if transactions is not None:
        for item in transactions:
            if item.category.isExpense:
                expenses += item.amount
            else:
                income += item.amount
    return jsonify({
        'expenses': expenses,
        'income': income
    })


def categorize_transactions(all_data, filter):
    categories = []
    for category in all_data:
        transactions = []
        for transaction in category.transactions:
            if filter(transaction.date):
                transactions.append(transaction)
        category.transactions = transactions
        amount = sum(
            [transaction.amount for transaction in category.transactions])
        count = len(category.transactions)
        categorize = TransactionCategory(category=category,
                                         amount=amount, count=count)
        categories.append(categorize)
    return categories


@app_views.route('/daily/transactions', methods=['GET'], strict_slashes=False)
@token_required
def daily_transactions(user_data):
    now = datetime.today()
    today = datetime(year=now.year, month=now.month,
                     day=now.day, hour=0, minute=0, second=0)
    query = storage.query(Categories).\
        join(Transactions).\
        filter(Transactions.userId == user_data.id,
               Transactions.date == today).\
        order_by(Categories.name)
    all_data = query.all()
    from sys import stdout
    categories = categorize_transactions(all_data, lambda date: date == today)

    print(query, file=stdout)
    print(today, file=stdout)
    return jsonify([item.to_dict() for item in categories])


@app_views.route('/weekly/transactions', methods=['GET'], strict_slashes=False)
@token_required
def weekly_transactions(user_data):
    today = datetime.today()
    weekstart = today - timedelta(days=today.weekday())
    weekend = weekstart + timedelta(days=6)

    from sys import stdout
    print(weekstart, file=stdout)
    all_data = storage.query(Categories).\
        join(Transactions).\
        filter(
        Transactions.userId == user_data.id,
        Transactions.date >= weekstart,
        Transactions.date <= weekend).\
        order_by(Categories.name).all()
    categories = categorize_transactions(all_data,
                                         lambda date: date >= weekstart and date <= weekend)
    return jsonify([item.to_dict() for item in categories])


@app_views.route('/monthly/transactions', methods=['GET'], strict_slashes=False)
@token_required
def monthly_transactions(user_data):
    now = datetime.today()
    month, totalDays = monthrange(now.year, now.month)
    firstDayOfMonth = datetime(year=now.year, month=now.month, day=1)
    lastDayOfMonth = datetime(year=now.year, month=now.month, day=totalDays)

    all_data = storage.query(Categories).\
        join(Transactions).\
        filter(
        Transactions.userId == user_data.id,
        Transactions.date >= firstDayOfMonth,
        Transactions.date <= lastDayOfMonth).\
        order_by(Categories.name).all()

    categories = categorize_transactions(all_data,
                                         lambda date: date >= firstDayOfMonth and date <= lastDayOfMonth)
    return jsonify([item.to_dict() for item in categories])


@app_views.route('/yearly/transactions', methods=['GET'], strict_slashes=False)
@token_required
def yearly_transactions(user_data):
    today = datetime.today()
    lastTwoYears = datetime(year=today.year - 2, month=1, day=1)

    all_data = storage.query(Categories).join(Categories.transactions).filter(
        Transactions.userId == user_data.id).order_by(Categories.name).all()

    categories = categorize_transactions(all_data,
                                         lambda date: date >= lastTwoYears and
                                         date <= today)
    return jsonify([item.to_dict() for item in categories])
