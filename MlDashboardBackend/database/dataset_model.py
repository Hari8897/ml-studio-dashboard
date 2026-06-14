from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,Numeric, func
from database.db import Base
   
class Dataset(Base):
    __tablename__ = "datasets"
    
    user_id = Column(Integer, ForeignKey("users.id"))
    username = Column(String(100))
    datasetid = Column(Integer, primary_key=True, index=True)
    datasetname = Column(String(225))
    file_path = Column(String(500))
    rows = Column(Integer)
    columns = Column(Integer)
    filesize_mb = Numeric(10,2) 
    upload_time = Column(DateTime, server_default=func.now()) 
      
