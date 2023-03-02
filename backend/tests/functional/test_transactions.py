from tests.functional import log_in_token


def test_all_transactions(test_client):
    response = log_in_token('/api/transactions', 'get', test_client)
    assert 200 == response.status_code
    assert b'"page":' in response.data
    assert b'"perPage":' in response.data
    assert b'"totalItems"' in response.data
    assert b'"totalPages"' in response.data
    assert b'"items"' in response.data


def test_create_transaction(test_client):
    response = log_in_token('/api/transactions', 'post',
                            test_client, data="Hello")
    assert b'{"error":"not a json"}\n' == response.data
    assert 401 == response.status_code

    response = log_in_token('/api/transactions', 'post',
                            test_client, json={'sample': 'sample'})
    assert b'{"error":"data incomplete"}\n' == response.data
    assert 401 == response.status_code

    response = log_in_token('/api/transactions', 'post', test_client, json={
        'sample': 'sample'})
    assert b'"error":"sorry the category ID not found in the json"}\n' == response.data
    assert 401 == response.status_code


def close(test_client):
    log_in_token('api/delete_user', 'delete', test_client)
