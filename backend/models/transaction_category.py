#!/usr/bin/python
""" Categorize Transactions """
from models.base_model import BaseModel


class TransactionCategory(BaseModel):
    """Representation of the transaction category model"""
    category = None
    count = 0
    amount = 0
    
    def __init__(self, *args, **kwargs):
        """initializes categories"""
        super().__init__(*args, **kwargs)
