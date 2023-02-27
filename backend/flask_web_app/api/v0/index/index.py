#!/usr/bin/python3
""" Index """
from api.v0.index import index_views
from flask import current_app, jsonify, request, send_file
from flasgger.utils import swag_from
import uuid
from os import path
from api import v0
from email_validator import validate_email, EmailNotValidError
from flask_mail import Message


@index_views.route('/', methods=['GET'], strict_slashes=False)
@swag_from('documentation/index/root.yml', methods=['GET'])
def root():
    """Index of API"""
    return jsonify({"message": "welcome home {}".format(uuid.uuid4())})


@index_views.route('/status', methods=['GET'], strict_slashes=False)
@swag_from('documentation/index/status.yml', methods=['GET'])
def status():
    """status function"""
    return jsonify({"status": "OK"})


@index_views.route('/colors/<palette>/')
@swag_from('documentation/index/colors.yml', methods=['GET'])
def colors(palette):
    """
    colors function
    """
    all_colors = {
        'cmyk': ['cyan', 'magenta', 'yellow', 'black'],
        'rgb': ['red', 'green', 'blue']
    }
    if palette == 'all':
        result = all_colors
    else:
        result = {palette: all_colors.get(palette)}

    return jsonify(result)


@index_views.route('/server')
@swag_from('documentation/index/server_name.yml', methods=['GET'])
def server_name():
    return jsonify({'servername': current_app.config['SERVER_NAME']})


@index_views.route('/media/<username>/<filename>', methods=['GET'], strict_slashes=True)
@swag_from('documentation/index/media.yml', methods=['GET'])
def media(username, filename):
    file_path = path.join(
        current_app.config['ROOT_PATH'],
        current_app.config['UPLOAD_FOLDER'],
        username, filename
    )
    if not path.exists(file_path):
        return jsonify({'error': 'sorry file does not exist'}), 400
    return send_file(file_path)


@index_views.route("/test_message", methods=['GET'], strict_slashes=True)
def index():

    msg = Message(
        "Hello",
        recipients=["to@example.com, ekottifiok@gmail.com"])
    msg.html = """
    <!doctype html>
    <html lang="en-US">

    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Messaging Tests</title>
        <meta name="description" content="Reset Password Email Template.">
        <meta name="viewport" content="width=device-width" />
        <style type="text/css">
        
        
        </style>
    </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
    <b>Hey Paul, sending you this email from my Flask app, lmk if it works</b>
    </body>
    </html>
    """
    current_app.config['MAIL'].send(msg)
    return jsonify({"message": str(msg)})
