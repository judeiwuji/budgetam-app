from flask import Flask

app = Flask("Budgetam API")
app.config.from_object('config')
