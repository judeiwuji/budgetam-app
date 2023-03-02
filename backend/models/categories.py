#!/usr/bin/python
""" holds class users"""
from models import storage_t
from models.base_model import Base, BaseModel
from sqlalchemy import Boolean, Column, String
from sqlalchemy.orm import relationship


class Categories(BaseModel, Base):
    """Representation of the category model"""
    __tablename__ = 'categories'
    if storage_t == 'db':
        name = Column(String(30), nullable=False)
        icon = Column(String(
            255), default='https://robohash.org/odioexpeditapraesentium.png?size=50x50&set=set1')
        isExpense = Column(Boolean, default=False)
        transactions = relationship(
            'Transactions', back_populates='category')
    else:
        name = ""

    def __init__(self, *args, **kwargs):
        """initializes categories"""
        super().__init__(*args, **kwargs)
