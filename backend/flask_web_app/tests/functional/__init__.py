from json import loads

test_user_signup = {
    'username': 'test_user',
    'email': 'test_user@gmail.com',
    'password': 'test_user_password'
}

test_user_login = {key: val for key,
            val in test_user_signup.items() if key != 'email'}

def log_in_user(test_client, user=test_user_login):
    response = test_client.post('/api/login', json=user)
    return response, loads(response.data)['token']

def log_in_token(url:str, method:str, test_client):
    _, token = log_in_user(test_client)
    headers = {'Authorization': token}
    return eval(f"test_client.{method}('{url}', headers=headers)")