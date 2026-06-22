from sqlalchemy import Column, ForeignKeyConstraint, Integer, String, DateTime, ForeignKey,Numeric,LargeBinary,Boolean, func
from sqlalchemy.orm import relationship
from database.db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key = True, index=True)
    username = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(255))

class Dataset(Base):
    __tablename__ = "datasets"

    datasetid = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    username = Column(String(100))
    datasetname = Column(String(225))

    file_data = Column(LargeBinary, nullable=True)

    rows = Column(Integer)
    columns = Column(Integer)
    filesize_mb = Column(Numeric(10,2))
    upload_time = Column(DateTime, server_default=func.now())

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    token = Column(String(255), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    user = relationship("User")

    
    