from json import loads

test_user_signup = {
    'username': 'test_user',
    'email': 'test_user@gmail.com',
    'password': 'test_user_password'
}

test_user_login = {key: val for key,
            val in test_user_signup.items() if key != 'email'}

def log_in_user(test_client):
    response = test_client.post('/api/login', json=test_user_login)
    print(response.data)
    if 401 == response.status_code:
        test_client.put(path='api/signup', json=test_user_signup)
        response = test_client.post('/api/login', json=test_user_login)
    return response, loads(response.data)['token']

def log_in_token(url:str, method:str, test_client, data=None, json=None):
    response, token = log_in_user(test_client)
    print(response.data)
    headers = {'Authorization': token}
    return eval(f"test_client.{method}('{url}', headers={headers}, data=data, json=json)")
