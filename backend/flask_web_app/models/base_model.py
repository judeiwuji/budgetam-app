#!/usr/bin/python3
"""
Contains class BaseModel
"""
import models
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, DateTime
from datetime import datetime
import uuid
from api import time

classes = ["Categories", "Transactions", "Users", "Tokens"]

if models.storage_t == "db":
    Base = declarative_base()
else:
    Base = object


class BaseModel:
    id = Column(String(60), primary_key=True)
    created = Column(DateTime)
    updated = Column(DateTime)
    deleted = Column(DateTime, default=None)

    def __init__(self, *args, **kwargs) -> None:
        if kwargs:
            for key, value in kwargs.items():
                if key != "__class__":
                    # if key == 'password':
                    #     value = generate_password_hash(value)
                    setattr(self, key, value)
            if kwargs.get("created", None) and type(self.created) is str:
                self.created_at = datetime.strptime(kwargs["created_at"], time)
            else:
                self.created_at = datetime.utcnow()
            if kwargs.get("updated", None) and type(self.updated) is str:
                self.updated_at = datetime.strptime(kwargs["updated_at"], time)
            else:
                self.updated_at = datetime.utcnow()
            if kwargs.get("id", None) is None:
                self.id = str(uuid.uuid4())
        else:
            self.id = str(uuid.uuid4())
            self.created_at = datetime.utcnow()
            self.updated_at = self.created_at

    def __str__(self):
        """String representation of the BaseModel class"""
        return "[{:s}] ({:s}) {}".format(
            self.__class__.__name__, self.id,
            self.__dict__
        )

    def save(self):
        """updates the attribute 'updated_at' with the current datetime"""
        self.updated_at = datetime.utcnow()
        models.storage.new(self)
        models.storage.save()

    def to_dict(self, save_fs=None):
        """returns a dictionary containing all keys/values of the instance"""
        new_dict = self.__dict__.copy()
        if "created_at" in new_dict:
            new_dict["created_at"] = new_dict["created_at"].strftime(time)
        if "updated_at" in new_dict:
            new_dict["updated_at"] = new_dict["updated_at"].strftime(time)

        if "date" in new_dict:
            new_dict["date"] = new_dict["date"].strftime(time)

        new_dict["__class__"] = self.__class__.__name__
        if "_sa_instance_state" in new_dict:
            del new_dict["_sa_instance_state"]
        if save_fs is None:
            if "password" in new_dict and '__class__' not in new_dict:
                del new_dict["password"]
        if new_dict.get('category', None):
            new_dict['category'] = self.category.to_dict()

        if new_dict.get('transactions', None):
            new_dict['transactions'] = []
            for transaction in self.transactions:
                category = new_dict.copy()
                del category['transactions']
                transaction_dict = transaction.to_dict()
                transaction_dict['category'] = category
                new_dict['transactions'].append(transaction_dict)
        return new_dict

    def delete(self):
        """delete the current instance from the storage"""
        models.storage.delete(self)
