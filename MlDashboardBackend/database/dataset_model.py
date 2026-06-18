from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,Numeric,LargeBinary, func
from database.db import Base
   
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
      
