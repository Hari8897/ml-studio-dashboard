from fastapi_mail import ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME="harikanchu4275@gmail.com",
    MAIL_PASSWORD="Hari@4275",
    MAIL_FROM="harikanchu4275@gmail.com",
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)