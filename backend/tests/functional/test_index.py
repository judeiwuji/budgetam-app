from tests.conftest import test_client


def test_home_page(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is requested (GET)
    THEN check that the response is valic
    """

    response = test_client.get('/')
    assert response.status_code == 200
    assert b'{"message":"welcome home"}\n' == response.data


def test_status(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/status' page is requested (GET)
    THEN check that the response is valid
    """

    response = test_client.get('/status')
    assert response.status_code == 200
    assert b'{"status":"OK"}\n' == response.data


def test_api(test_client):
    """
    GIVEN a Flask application configured for testing
    WHEN the '/status' page is requested (GET)
    THEN check that the response is valid
    """
    response = test_client.get('/api')
    assert response.status_code == 200
    assert b'{"message":"welcome to the api view of budgetam"}\n' == response.data
