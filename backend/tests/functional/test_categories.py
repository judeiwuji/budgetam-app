from tests.functional import log_in_token


def test_all_categories(test_client):
    response = test_client.get('/api/categories')
    assert 200 == response.status_code
    assert b'"page":' in response.data
    assert b'"perPage":' in response.data
    assert b'"totalItems"' in response.data
    assert b'"totalPages"' in response.data
    assert b'"items"' in response.data


def test_create_category(test_client):
    response = log_in_token('/api/categories', 'put', test_client,
                            data="{'name': 'House', 'isExpense': 'true'}")
    assert b'{"error":"not a json"}\n' == response.data
    assert 401 == response.status_code

    response = log_in_token('/api/categories', 'put', test_client,
                            json={'name': 'House', 'isExpense': 'true'})
    assert response


def test_view_category(test_client):
    pass

def close(test_client):
    
    log_in_token('api/delete_user', 'delete', test_client)