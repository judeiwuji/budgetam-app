#!/usr/bin/python
""" holds class users"""
from models import storage_t
from models.base_model import Base, BaseModel
from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from datetime import datetime


class Transactions(BaseModel, Base):
    __tablename__ = 'transactions'
    if storage_t == 'db':
        date = Column(DateTime, default=datetime.utcnow())
        catId = Column(String(60), ForeignKey('categories.id'))
        userId = Column(String(60), ForeignKey('users.id'), nullable=False)
        amount = Column(Integer)
        note = Column(Text)
        category = relationship("Categories", lazy="joined")
    else:
        title = ""

    def __init__(self, *args, **kwargs):
        """initializes User"""
        super().__init__(*args, **kwargs)
