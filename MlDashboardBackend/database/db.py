
import os

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm  import sessionmaker, declarative_base
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).parent.parent / ".env"

load_dotenv(env_path) 

#print("DATABASE_URL: ", os.getenv("DATABASE_URL"))  # Debugging line to check if DATABASE_URL is loaded correctly 

DATABASE_URL = os.getenv("DATABASE_URL")

print(f"DATABASE_URL: {repr(DATABASE_URL)}")  # Debugging line to check the value of DATABASE_URL after loading .env file


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

    statements = []
    if "user_id" not in dataset_columns:
        statements.append("ALTER TABLE datasets ADD user_id INT NULL")
        dataset_columns.add("user_id")
    if "username" not in dataset_columns:
        statements.append("ALTER TABLE datasets ADD username VARCHAR(100) NULL")
        dataset_columns.add("username")  
          

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))

        if (
            "user_id" in dataset_columns
            and "username" in dataset_columns
            and inspector.has_table("users")
        ):
            connection.execute(text("""
                UPDATE datasets
                SET username = users.username
                FROM users
                WHERE datasets.user_id = users.id
                AND datasets.username IS NULL
            """))
            
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
