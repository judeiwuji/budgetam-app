#!/usr/bin/python
""" holds class users"""
from models import storage_t
from models.base_model import Base, BaseModel
from sqlalchemy import Column, ForeignKey, Integer, String, Text


class Transactions(BaseModel, Base):
    __tablename__ = 'transactions'
    if storage_t == 'db':
        title = Column(String(50), nullable=False)
        cat_id = Column(Integer, ForeignKey('categories.id'))
        user_id = Column(Integer, ForeignKey('users.id'))
        amount = Column(Integer)
        note = Column(Text)
    else:
        title = ""

    def __init__(self, *args, **kwargs):
        """initializes User"""
        super().__init__(*args, **kwargs)