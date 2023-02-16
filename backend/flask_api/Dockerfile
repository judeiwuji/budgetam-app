FROM python:3.8-slim-buster

COPY requirements.txt .

RUN apt-get update && \
    apt-get install -y default-libmysqlclient-dev gcc python3-lxml && \
    pip install -U pip && \
    pip install -r requirements.txt

WORKDIR /budgetam_api
COPY .  .

EXPOSE 5000
