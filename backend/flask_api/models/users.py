#!/usr/bin/python
""" holds class users"""
from models import storage_t
from models.base_model import Base, BaseModel
from sqlalchemy import Column, String
from hashlib import md5


class Users(BaseModel, Base):
    """Representation of the User Model"""
    __tablename__ = 'users'
    if storage_t == 'db':
        username = Column(String(60), nullable=False)
        email = Column(String(255), nullable=False)
        password = Column(String(255), nullable=False)
    else:
        username = ""
        email = ""
        password = ""

    def __init__(self, *args, **kwargs):
        """initializes User"""
        super().__init__(*args, **kwargs)
