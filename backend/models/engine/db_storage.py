#!/usr/bin/python3
"""
Contains the class DBStorage
"""

import models
from models.base_model import Base
from models.engine import classes
from os import getenv
from sqlalchemy import create_engine
from sqlalchemy.engine.url import URL
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.exc import InvalidRequestError


class DBStorage:
    """interaacts with the MySQL database"""
    __engine = None
    __session = None

    def __init__(self):
        """Instantiate a DBStorage object"""
        db_url = {
            'database': getenv('MYSQL_DB'),
            'drivername': 'mysql',
            'username': getenv('MYSQL_USER'),
            'password': getenv('MYSQL_PWD'),
            'host': getenv('MYSQL_HOST'),
            'port': 3306,
            'query': {'charset': 'utf8mb4'},  # the key-point setting
        }
        self.__engine = create_engine(URL(**db_url))

    def all(self, cls=None) -> dict:
        """query on the current database session"""
        if cls in classes:
            return self.__session.query(cls).all()

    def new(self, obj):
        """add the object to the current database session"""
        self.__session.add(obj)

    def save(self):
        """commit all changes of the current database session"""
        self.__session.commit()

    def delete(self, obj=None):
        """delete from the current database session obj if not None"""
        if obj is not None:
            self.__session.delete(obj)
            self.save()

    def reload(self):
        """reloads data from the database"""
        Base.metadata.create_all(self.__engine)
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(sess_factory)
        self.__session = Session

    def close(self):
        """call remove() method on the private session attribute"""
        self.__session.remove()

    def get(self, cls=None, id=None):
        """
        Returns the object based on the class name and its ID, or
        None if not found
        """
        if cls and id:
            objs = self.__session.query(cls).get(id)
            return objs
        return None

    def get_param(self, cls=None, *args, **kwargs):
        """Filters the object and ges the first item"""
        if cls and kwargs and cls in classes:
            try:
                return self.__session.query(cls).filter_by(**kwargs).first()
            except InvalidRequestError:
                pass

    def filter(self, cls=None, *args, **kwargs):
        """Filters the object"""
        if cls and kwargs and cls in classes:
            try:
                return self.__session.query(cls).filter_by(**kwargs).all()
            except InvalidRequestError:
                return None

    def query(self, cls=None):
        return self.__session.query(cls)

    def count(self, cls=None):
        """
        count the number of objects in storage
        """
        all_class = classes.values()

        if not cls:
            count = 0
            for clas in all_class:
                count += len(models.storage.all(clas).values())
        else:
            count = len(models.storage.all(cls).values())

        return count
