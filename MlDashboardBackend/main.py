from ast import Not
from doctest import DebugRunner, debug
from email.policy import HTTP
from tkinter.tix import STATUS
from fastapi import Depends, FastAPI, Form, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from pydantic import BaseModel
import pandas as pd
import numpy as np
import json
import io, os

from sqlalchemy.orm import Session

from database.db import Base, engine, SessionLocal, ensure_database_schema,get_db

from database.dataset_model import Dataset
from database.user_model import User

from auth import router as auth_router

from models.preprocessing import preprocessData
from models.model import trainModel

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse





app = FastAPI()
Base.metadata.create_all(bind=engine)
ensure_database_schema()

origins =[
    "http://localhost:5173",
    "https://ml-studio-dashboard-2-law6.onrender.com"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers=["*"]
    )


class DatasetRequest(BaseModel):
    datasetname: str
    file_path:str
    rows:int
    column: int


# Request schema
class DataRequest(BaseModel):
    target: str

class PreprocessRequest(BaseModel):
    features: List[Dict[str, Any]]
    target: List[Any]
    options: Dict[str, Any]

# ----------- Request Schema -----------
class TrainRequest(BaseModel):
    features: List
    target: List
    featureNames: List  # important for feature importance

# ----------- Response Schema -----------
class TrainResponse(BaseModel):
    model: str
    predictions: List[float]
    score: float
    metric: str
    feature_importance: dict


dataStore = {}

app.include_router(auth_router, prefix="/auth")

@app.post("/upload")
async def upload(user_id: int = Form(...), file: UploadFile = File(...)):     
    # print("Received file:", file.filename)
    # print("Content type:", file.content_type)
    
    try:
        contents = await file.read()  # async read  
        filename = file.filename.lower()

        # Read the dataset for validation        
        if filename.endswith(".csv"):
            try:
                decoded = contents.decode("utf-8-sig")
            except Exception as e:
                decoded = contents.decode("latin-1")

            s = io.StringIO(decoded)  
            df = pd.read_csv(s, sep=None, engine='python', on_bad_lines='skip')
      
        elif filename.endswith(".xlsx"):
            df = pd.read_excel(io.BytesIO(contents))
        else:
            raise HTTPException(status_code=400, detail="Only CSV and XLSX files are supported")

        if df.empty:
            return {"error": "Empty dataset"}

        rows = df.shape[0]
        columns = df.shape[1]

        # file_path = f"uploads/{file.filename}"
        # UPLOAD_FOLDER = "uploads"
        # os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # ✅ create if not exists
        # file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        # with open(file_path, "wb") as f:
        #     f.write(contents)
        # filesize_bytes = os.path.getsize(file_path)
        filesize_bytes = len(contents)
        filesize_mb = round(filesize_bytes/(1024*1024),2)

        db = SessionLocal()
        try:
            user =(db.query(User)
                   .filter(User.id == user_id)
                   .first())
            if not user:
                return {
                    "error": "Invalid user. Please log in again."
                    }

            new_dataset = Dataset(
                user_id=user.id,
                username=user.username,
                datasetname=file.filename,
                # file_path=file_path,

                # Stored in POSTGRESQL
                file_data = contents,

                rows=rows,
                columns=columns,
                filesize_mb  = filesize_mb 
              
                )

            db.add(new_dataset)
            db.commit()
            db.refresh(new_dataset)

        finally:
            db.close()

        df = df.replace([float("inf"), float("-inf")], None)
        df = df.where(pd.notnull(df), None)

        dataStore['df'] = df

        return {
            "dataset_id": new_dataset.datasetid,
            "columns": df.columns.tolist(),
            "preview": df.head(10).to_dict(orient='records'),  # limit preview
            "filesize_mb": new_dataset.filesize_mb  
        }

    except Exception as e:
        print("UPLOAD ERROR:", str(e))
        return {"error": str(e)}

    
@app.get("/datasets/{user_id}")
async def get_user_dataset(user_id: int, db: Session = Depends(get_db)):
    datasets = (db.query(Dataset)
        .filter(Dataset.user_id== user_id)
        .all()
        )
    return datasets 

@app.get("/datasets-preview/{datasetid}")
async def get_dataset_preview(
    datasetid: int,
    db: Session = Depends(get_db)
    ):
    dataset = (db.query(Dataset)
               .filter(Dataset.datasetid==datasetid)
               .first()
               )
    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
            )
    # file_path = dataset.file_path

    # if not os.path.exists(file_path):
    #     raise HTTPException(status_code=404, detail=f"File not found: {file_path}")
    try: 
        # if file_path.endswith(".csv"):
        #     df = pd.read_csv(file_path)
        # elif file_path.endswith((".xlsx",".xls")):
        #     df = pd.read_excel(file_path)
  
        contents = dataset.file_data

        if contents is None:
            raise HTTPException(
                status_code=404, 
                detail="Dataset file data not found"
                )

        #CSV
        if dataset.datasetname.lower().endswith(".csv"):
            try:
                decoded = contents.decode("utf-8-sig")
            except:
                decoded = contents.decode("latin-1")

            s = io.StringIO(decoded)  
            df = pd.read_csv(
                s,
                sep=None,
                engine='python',
                on_bad_lines='skip'
                )
        # EXCEL
        elif dataset.datasetname.lower().endswith(".xlsx",".xls"):
            s = io.StringIO(contents)
            df = pd.read_excel(s)

        else:
             raise HTTPException(status_code=400, detail="Unsupported file format")


        if df is not None and not df.empty:
            dataStore['df'] = df
        else:
            return {"error": "Dataset is empty"}

        return {
            "datasetid": dataset.datasetid,
            "datasetname": dataset.datasetname,
            "columns": df.columns.tolist(),
            "preview": df.head(20).to_dict(orient="records"),
            "shape": {
                "rows":len(df),
                "columns":len(df.columns)
                }
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e));


@app.post("/selectTarget")
async def get_target(request: DataRequest):
    try:
        # Get stored dataframe
        df = dataStore.get('df')

        if df is None:
            return {"error": "No dataset uploaded"}

        target = request.target

        # Validate target column
        if target not in df.columns:
            return {"error": f"{target} not found in dataset"}

        # Split data
        X = df.drop(columns=[target])
        y = df[[target]]
        print("features", X)
        return {
            "features": X.to_dict(orient="records"),
            "target": y.to_dict(orient="records"),
            "feature_columns": list(X.columns),
            "target_column": target
        }

    except Exception as e:
        return {"error": str(e)}


@app.post("/preprocess")
async def preprocess(data: PreprocessRequest):
    print("preprocess", data)
    try:
        df= pd.DataFrame(data.features)
        target= data.target
        options = data.options
        df=preprocessData(df, options)
        return {
			"features":df.to_dict(orient="records"),
			"target": target
		}
    except Exception as e:
        return {"error":str(e)}

@app.post("/correlation")
async def correlation(file: UploadFile=File(...)):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    corr=df.corr(numeric_only=True)
    corr = corr.fillna(0)

    return {
        "matrix": corr.values.tolist(),
        "columns":list(corr.columns)
        }


@app.post("/train")
async def traiModel( data: TrainRequest):
    #print("Received Raw Data:",data)
    #return {"message":"received"}
    try:
        X = pd.DataFrame(data.features, columns=data.featureNames)
        y = pd.Series( data.target)
        
        # Train model
        results = trainModel(X, y)
        
        return results
        
    except Exception as e:
        print("TRAINING ERROR:", str(e))
        return {"error":str(e)} 
    
    
# app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")  

# app.get("/{full_path:path}")
# async def serve_react(full_path: str):
#     return FileResponse("dist/index.html")



