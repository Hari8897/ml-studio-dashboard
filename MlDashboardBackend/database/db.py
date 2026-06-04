import urllib
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm  import sessionmaker, declarative_base


connectionString = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=HARIKANCHU;"
    "Database=DataScience;"
    "Trusted_Connection=yes;"
    
    )

params = urllib.parse.quote_plus(connectionString)
engine = create_engine(f"mssql+pyodbc:///?odbc_connect={params}")

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
                SET datasets.username = users.username
                FROM datasets
                INNER JOIN users ON datasets.user_id = users.id
                WHERE datasets.username IS NULL
            """))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
