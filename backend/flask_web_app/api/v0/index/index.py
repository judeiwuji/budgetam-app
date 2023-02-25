#!/usr/bin/python3
""" Index """
from api.v0.index import index_views
from flask import current_app, jsonify, send_file
from flasgger.utils import swag_from
import uuid
from os import path


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

@index_views.route('/server/')
def server_name():
    return jsonify({'servername': current_app.config['SERVER_NAME']})

@index_views.route('/media/<username>/<filename>', methods=['GET'], strict_slashes=True)
def media(username, filename):
    file_path = path.join(
        current_app.config['ROOT_PATH'],
        current_app.config['UPLOAD_FOLDER'],
        username, filename
    )
    if not path.exists(file_path):
        return jsonify({'error': 'sorry file does not exist'}), 400
    return send_file(file_path)
    