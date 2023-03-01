export API_PORT=6000 \
    MYSQL_USER=budgetam_backend_user \
    MYSQL_PWD=helloworld2024 \
    MYSQL_HOST=localhost \
    MYSQL_DB=budgetam_db \
    TYPE_STORAGE=db

python -m api.v0.entrypoint