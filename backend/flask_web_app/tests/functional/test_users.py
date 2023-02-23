from api import time
from json import loads
from jwt import encode, decode
from datetime import datetime
from flask import current_app
from tests.functional import log_in_token, log_in_user, test_user_signup




def test_signup(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is requested (GET)
    THEN check that the response is valic
    """
    


    url = '/api/signup'

    # performing a get on the url
    response = test_client.get(path=url)
    assert 200 == response.status_code
    assert b'{"accepts":' in response.data
    assert b'"email":"required"' in response.data
    assert b'"password":"required"' in response.data
    assert b'"username":"required"' in response.data

    # performing a post on the url
    response = test_client.post(path=url)
    assert 200 == response.status_code
    assert b'{"accepts":' in response.data
    assert b'"email":"required"' in response.data
    assert b'"password":"required"' in response.data
    assert b'"username":"required"' in response.data

    # the json data is not valid
    response = test_client.put(path=url, data='{"data", "data"}')
    assert 401 == response.status_code
    assert b'{"error":"not a json"}\n' == response.data

    # the json data is not equals to 3
    response = test_client.put(path=url, json={"data": "data"})
    assert 401 == response.status_code
    assert b'{"error":"data incomplete"}\n' == response.data

    # the json data is 2 but does not include username or password
    response = test_client.put(path=url, json={"data":"data", "datag":"datag", "datags":"datags"})
    assert 401 == response.status_code
    assert b'{"error":"sorry could not handle that, check data."}\n' == response.data

    # testing the email validator by sending a wrong email
    response = test_client.put(path=url, json={
        'username': 'test_user',
        'email': 'test_user@example.com',
        'password': 'test_user_password'})
    assert 401 == response.status_code
    assert b'{"error":"email not valid"}\n' == response.data

    # testing the email validator by sending a wrong email
    response = test_client.put(path=url, json=test_user_signup)
    print(response.data)
    assert 201 == response.status_code
    assert b'{"message":"user created successful"}\n' == response.data

def test_login(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is requested (GET)
    THEN check that the response is valic
    """
    

    url = '/api/login'

    response = test_client.get(path=url)
    assert 200 == response.status_code
    assert b'{"accepts":' in response.data
    assert b'"password":"required"' in response.data
    assert b'"username":"required"' in response.data

    # the json data is not valid
    response = test_client.post(path=url, data='{"data", "data"}')
    assert 401 == response.status_code
    assert b'{"error":"not a json"}\n' == response.data
    
    # the json data is not equals to 2
    response = test_client.post(path=url, json={"data": "data"})
    assert 401 == response.status_code
    assert b'{"error":"data incomplete"}\n' == response.data

    # the json data is 2 but does not include username or password
    response = test_client.post(path=url, json={"data":"data", "datag":"datag"})
    assert 401 == response.status_code
    assert b'{"error":"sorry could not handle that, check data."}\n' == response.data

    # logging a user that has not signed up before
    response = test_client.post(path=url, json={'username': 'test_useSr', 'password': 'test_user_passwSord'})
    assert 401 == response.status_code
    assert b'{"error":"sorry you need to create an account"}\n' == response.data

    # logging a signed up user with a wrong password
    response = test_client.post(path=url, json={'username': 'test_user', 'password': 'test_user_password_s'})
    assert 401 == response.status_code
    assert b'{"error":"sorry your password is not correct"}\n' == response.data

    response, token = log_in_user(test_client)
    assert 201 == response.status_code
    assert b'"expiresAt":' in response.data

    # test that token carries the correct data
    expires_at = datetime.strptime(loads(response.data)['expiresAt'].replace(' ', 'T'), time)       # from response
    expires = datetime.strptime(decode(
        token, 
        current_app.config['SECRET_KEY'],
        algorithms="HS256")['expireAt'], time)          # from jwt
    assert expires == expires_at


def test_logout(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/api/logout' page is requested (GET)
    THEN check that the response is valic
    """
    response = log_in_token('api/logout', 'get', test_client)
    assert 201 == response.status_code
    assert b'{"message":"successfully logged out"}\n' == response.data


def test_delete_user(test_client):
    """
    GIVEN
    WHEN
    THEN
    """
    response = log_in_token('api/delete_user', 'delete', test_client)
    assert 201 == response.status_code
    assert b'{}\n' == response.data