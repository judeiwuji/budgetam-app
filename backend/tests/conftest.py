from pytest import fixture
from tests import flask_app

@fixture(scope='module')
def  test_client():
    with flask_app.test_client() as testing_client:
        yield testing_client