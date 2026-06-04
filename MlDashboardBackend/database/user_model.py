from sqlalchemy import Column, Integer, String
from database.db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key = True, index=True)
    username = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(255))
    
    