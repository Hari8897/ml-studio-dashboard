from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression, LinearRegression
from sklearn.ensemble import RandomForestClassifier,RandomForestRegressor
from sklearn.metrics import accuracy_score, r2_score
import pandas as pd
import numpy as np



def detectProblemtype(y):
    if y.dtype == "object" or y.nunique()<20:
        return "classification"
    else:
        return "regression"

def trainModel(X, y):
    valid_rows = X.dropna().index
    X = X.loc[valid_rows]
    y = y.loc[valid_rows]

    X= pd.get_dummies(X)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    problem_type = detectProblemtype(y)

    modelName = ""
    predictions= []
    score = 0
    metric = ""
    
    if problem_type =="classification":
        lr = LogisticRegression(max_iter=1000)
        lr.fit(X_train, y_train)
        lr_preds = lr.predict(X_test)
        lr_score = accuracy_score(y_test,lr_preds)
        

        rfc = RandomForestClassifier()
        rfc.fit(X_train, y_train)
        rfc_preds = rfc.predict(X_test)
        rfc_score = accuracy_score(y_test, rfc_preds)
       
        if rfc_score> lr_score:
            model = rfc
            predictions = rfc_preds
            score = rfc_score
            modelName = "RandomForestClassifier"
        else:
            model = lr 
            predictions = lr_preds
            score = lr_score
            modelName = "LogisticRegression"
        metric = "accuracy"

    else:
        lr = LinearRegression()
        lr.fit(X_train,y_train)

        lr_preds = lr.predict(X_test)
        lr_score = r2_score(y_test, lr_preds)
        

        rf = RandomForestRegressor()
        rf.fit(X_train, y_train)
        rf_preds = rf.predict(X_test)
        rf_score = r2_score(y_test, rf_preds)

        if rf_score > lr_score:
            model = rf
            predictions = rf_preds
            score = rf_score
            modelName = "RandomForestRegressor"
        else:
            model = lr 
            predictions = lr_preds
            score = lr_score
            modelName = "LinearRegression"
        metric = "r2 Score"

    importance = []
    if hasattr(model, "feature_importances_"):
        importance =[
            {"feature": col, "importance":float(imp)}
            for col, imp in zip(X.columns, model.feature_importances_)
            ]
    elif hasattr(model, "coef_"):
        coefficients = np.asarray(model.coef_)
        if coefficients.ndim > 1:
            coefficients = np.mean(np.abs(coefficients), axis=0)
        else:
            coefficients = np.abs(coefficients)

        importance =[
            {"feature": col, "importance":float(coef)}
            for col, coef in zip(X.columns, coefficients)
            ]
    
    return {
        "model":modelName,
        "predictions":predictions.tolist(),
        "score":float(score),
        "metric":metric,
        "feature_importance":importance
        }
