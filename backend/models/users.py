#!/usr/bin/python
""" holds class users"""
from models import storage_t
from models.base_model import Base, BaseModel
from sqlalchemy import Boolean, Column, String


class Users(BaseModel, Base):
    """Representation of the User Model"""
    __tablename__ = 'users'
    if storage_t == 'db':
        username = Column(String(60), nullable=False, unique=True)
        avatar = Column(String(255))
        email = Column(String(255), nullable=False, unique=True)
        password = Column(String(255), nullable=False)
        token = Column(String(255), unique=True)
        verified = Column(Boolean, default=False)
    else:
        username = ""
        email = ""
        password = ""

    def __init__(self, *args, **kwargs):
        """initializes User"""
        super().__init__(*args, **kwargs)
