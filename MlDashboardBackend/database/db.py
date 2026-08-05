
import os

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm  import sessionmaker, declarative_base
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent / ".env"

load_dotenv(env_path) 

#print("DATABASE_URL: ", os.getenv("DATABASE_URL"))  # Debugging line to check if DATABASE_URL is loaded correctly 

DATABASE_URL = os.getenv("DATABASE_URL")

#  print(f"DATABASE_URL: {repr(DATABASE_URL)}")  # Debugging line to check the value of DATABASE_URL after loading .env file


# print("DATABASE_URL after loading: ", DATABASE_URL)  # Debugging line to check if DATABASE_URL is loaded correctly after loading .env file 
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")
  
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=True
)

SessionLocal = sessionmaker(
    autocommit = False,
    autoflush=False,
    bind=engine)

Base = declarative_base()


def ensure_database_schema():
    inspector = inspect(engine)

    if not inspector.has_table("datasets"):
        return

    dataset_columns = {
        column["name"].lower()
        for column in inspector.get_columns("datasets")
    }

    user_columns = [
        column["name"].lower()
        for column in inspector.get_columns("users")
    ]

    PasswordResetToken_columns = [
        column["name"].lower()
        for column in inspector.get_columns("password_reset_tokens")
    ]

    

    statements = []
    # dataset table query
    if "user_id" not in dataset_columns:
        statements.append("ALTER TABLE datasets ADD user_id INT NULL")
        dataset_columns.add("user_id")
    if "username" in dataset_columns:
        statements.append("ALTER TABLE datasets drop username")
        dataset_columns.add("username") 
    if "datasetid" in dataset_columns:
        statements.append("ALTER TABLE datasets RENAME COLUMN  datasetid to dataset_id")
        dataset_columns.add("dataset_id")

    



    # Sql users table query
    if "id" in user_columns:
        statements.append("ALTER TABLE users RENAME COLUMN  id to user_id")
        user_columns.append("user_id")
    if "created_at" not in user_columns:
        statements.append("ALTER TABLE users ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
        user_columns.append("created_at")
    if "updated_at" not in user_columns:
        statements.append("ALTER TABLE users ADD updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
        user_columns.append("updated_at")
    if "last_login" not in user_columns:
        statements.append("ALTER TABLE users ADD last_login TIMESTAMP")
        user_columns.append("last_login") 

    # password_reset_tokens table query
    if "token" in PasswordResetToken_columns:
        statements.append("ALTER TABLE password_reset_tokens RENAME COLUMN  token to password_token")
        PasswordResetToken_columns.append("password_token")

          

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
            
    #inspector = inspect(engine)

try:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
except Exception as e:
    print(f"Database connection failed: {e}")
    raise

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
