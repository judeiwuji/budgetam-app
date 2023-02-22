from api.v0.entrypoint import create_flask_app

def test_home_page():
    """
    GIVEN a Flask application configured for testing
    WHEN the '/' page is requested (GET)
    THEN check that the response is valic
    """
    flask_app = create_flask_app('config_test.py')
    with flask_app.test_client() as test_client:
        response = test_client.get('/')
        assert response.status_code == 200
        assert b'{"message":"welcome home"}\n' in response.data
