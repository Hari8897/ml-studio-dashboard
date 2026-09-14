
from fastapi import Depends, FastAPI, Form, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from pydantic import BaseModel, Tag
import pandas as pd
import numpy as np
import json
import io, os

from sqlalchemy.orm import Session

from database.db import Base, engine, SessionLocal, ensure_database_schema,get_db

from database.db_models import Dataset, User

from routes.auth import router as auth_router

from models.preprocessing import preprocessData, preprocessTarget, generate_dataset_overview
from models.model import trainModel

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from jose import jwt 
from fastapi.security import OAuth2PasswordBearer

from utils.security import SECRET_KEY, ALGORITHM, create_access_token, OAuth2AuthorizationCodeBearer

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
# Genereate JWT on login

# access_token = create_access_token(
#     data={"user_id": User.user_id}
#     )

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(
        token: str=Depends(oauth2_scheme),
        db:Session = Depends(get_db)
):

    payload = jwt.decode(token, SECRET_KEY, algorithms= [ALGORITHM])
    user_id = payload.get("user_id")
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=40)
    return user


class DatasetRequest(BaseModel):
    datasetname: str
    rows:int
    column: int


# Request schema
class DataRequest(BaseModel):
    target: str

class PreprocessRequest(BaseModel):
    dataset_id: int
    features: List[Dict[str, Any]]
    target: List[Any]
    options: Dict[str, Any]

# ----------- Request Schema -----------
class TrainRequest(BaseModel):
    dataset_id: int
    features: List
    target: List
    featureNames: List  # important for feature importance

# ----------- Response Schema -----------
class TrainResponse(BaseModel):
    model: str
    predictions: List[Any]
    actual_values: List[Any]
    score: float
    metric: str
    problem_type: str
    metrics: Dict[str, Any]
    feature_importance: List[Dict[str, Any]]


dataStore = {}

app.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"]
    )

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
      
        elif filename.endswith(".xlsx",".xls"):
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
                   .filter(User.user_id == user_id)
                   .first())
            if not user:
                return {
                    "error": "Invalid user. Please log in again."
                    }

            new_dataset = Dataset(
                user_id=user.user_id,
                #username=user.username,
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
            "dataset_id": new_dataset.dataset_id,
            "columns": df.columns.tolist(),
            "preview": df.head(10).to_dict(orient='records'),  # limit preview
            "filesize_mb": new_dataset.filesize_mb  
        }

    except Exception as e:
        return {"error": str(e)}

    
@app.get("/datasets/{user_id}")
async def get_user_dataset(user_id: int, db: Session = Depends(get_db)):
    datasets = (db.query(Dataset)
        .filter(Dataset.user_id== user_id)
        .order_by(Dataset.dataset_id.desc())
        .limit(5)
        .all()
        )
    return datasets 

@app.get("/datasets/recent")
async def get_recent_datasets(
    current_user: User = Depends(get_current_user),
    db: Session =Depends(get_db) 
):
    datasets = (db.query(Dataset)
        .filter(Dataset.user_id== current_user.user_id)
        .order_by(Dataset.dataset_id.desc())
        .limit(5)
        .all()
        )
    return datasets  
    

@app.get("/datasets-preview/{dataset_id}")
async def get_dataset_preview(
    dataset_id: int,
    db: Session = Depends(get_db) 
    ):
    dataset = (db.query(Dataset)
               .filter(Dataset.dataset_id==dataset_id)
               .first()
               )
    if not dataset:
        raise HTTPException(
            status_code=404,
            detail="Dataset not found"
        )

    contents = dataset.file_data
    
    if contents is None:
        raise HTTPException(
            status_code=404, 
            detail="Dataset file data not found"
            )
    
    try:     

        #CSV
        if dataset.datasetname.lower().endswith(".csv"):
            try:
                decoded = contents.decode("utf-8-sig")
            except UnicodeDecodeError:
                decoded = contents.decode("latin-1")

            s = io.StringIO(decoded)  
            df = pd.read_csv(
                s,
                sep=None,
                engine='python',
                on_bad_lines='skip'
                )
        # EXCEL
        elif dataset.datasetname.lower().endswith((".xlsx",".xls")):
            s = io.BytesIO (contents)
            df = pd.read_excel(s)

        else:
             raise HTTPException(status_code=400, detail="Unsupported file format")


        if df is None or  df.empty:

            return {"error": "Dataset is empty"}

        #store dataframe
        dataStore['df'] = df

        #Generate metadata
        overview = generate_dataset_overview(df)

        return {
            "dataset_id": dataset.dataset_id,
            "datasetname": dataset.datasetname,

            "overview": {
                "total_rows":overview["total_rows"],
                "total_columns":overview["total_columns"],
                "missing_percentage": overview["missing_percentage"],
                "categorical_columns": overview["categorical_columns"],
                "numerical_columns": overview["numerical_columns"],
                "duplicate_percentage":overview["duplicate_percentage"]
            },
            "columns_summary": overview["columns"],
            "columns": df.columns.tolist(),
            "preview": df.head(20).to_dict(orient="records"),
            "shape": {
                "rows":len(df),
                "columns":len(df.columns)
                }
            }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




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
        return {
            "features": X.to_dict(orient="records"),
            "target": y.to_dict(orient="records"),
            "feature_columns": list(X.columns),
            "target_column": target
        }

    except Exception as e:
        return {"error": str(e)}



@app.post("/preprocess")
async def preprocess(data: PreprocessRequest, dataset_id: int):
    try:
        df= pd.DataFrame(data.features)
        target= data.target
        options = data.options
        df=preprocessData(df, options)
        processed_target = preprocessTarget(target, options)
        return {
			"features":df.to_dict(orient="records"),
			"target": processed_target.to_dict(orient="records")
		}
    except Exception as e:
        return {"error":str(e)}

@app.post("/correlation")
async def correlation(file: UploadFile=File(...), dataset_id: int = None):
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    corr=df.corr(numeric_only=True)
    corr = corr.fillna(0)

    return {
        "matrix": corr.values.tolist(),
        "columns":list(corr.columns)
        }


@app.post("/train")
async def traiModel( data: TrainRequest, dataset_id: int = None):
    #print("Received Raw Data:",data)
    #return {"message":"received"}
    try:
        X = pd.DataFrame(data.features, columns=data.featureNames)
        y = pd.Series( data.target)
        
        # Train model
        results = trainModel(X, y)
        
        return results
        
    except Exception as e:
        return {"error":str(e)} 
    
    
# app.mount("/assets", StaticFiles(directory="dist/assets"), name="assets")  

# app.get("/{full_path:path}")
# async def serve_react(full_path: str):
#     return FileResponse("dist/index.html")



