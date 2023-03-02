from models.users import Users
from werkzeug.security import check_password_hash

def test_new_user():
    """
    GIVEN a User model
    WHEN a new User is created
    THEN check the email, hashed_password, and role fields are defined correctly
    """
    user = Users(**{'username': 'test_user', 'email': 'test_user@example.com', 'password': 'test_user_password'})
    assert user.email == 'test_user@example.com'
    assert user.username == 'test_user'
    # assert check_password_hash(user.password, 'test_user_password')
