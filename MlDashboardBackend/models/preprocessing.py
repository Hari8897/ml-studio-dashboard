from optparse import Option
from numpy._core.multiarray import scalar
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler, LabelEncoder


def preprocessData(df, options):
    # Columns selection
    if options.get("columns"):
        valid_cols = [col for col in options['columns'] if col in df.columns]
        if valid_cols:
            df = df[valid_cols]

    # missing values
    missing_num = options.get("missing_num") or options.get("missing")
    missing_cat = options.get("missing_cat")

    if missing_num == "drop" or missing_cat == "drop":
        df = df.dropna()
    elif missing_num == "mean":
        for col in df.select_dtypes(include = 'number').columns:
            df[col] = df[col].fillna(df[col].mean())
    elif missing_num == "median":
        for col in df.select_dtypes(include = 'number').columns:
            df[col] = df[col].fillna(df[col].median())
    elif missing_num == "zero":
         df = df.fillna(0)

    if missing_cat == "mode":
        for col in df.select_dtypes(include = 'object').columns:
            mode = df[col].mode(dropna=True)
            if not mode.empty:
                df[col] = df[col].fillna(mode.iloc[0])

    # Encoding
    if options.get("encoding")=="label":
        for col in df.select_dtypes(include = 'object').columns:
            df[col] = df[col].astype('category').cat.codes

    elif options.get("encoding")=="onehot":
        df=pd.get_dummies(df, drop_first=True)

    # Scaling
    if options.get("scaling") == "standard":
        scaler = StandardScaler()
        num_cols = df.select_dtypes(include=np.number).columns
        df[num_cols]=scaler.fit_transform(df[num_cols])

    elif options.get("scaling") == "minmax":
        scaler = MinMaxScaler()
        num_cols = df.select_dtypes(include=np.number).columns
        df[num_cols]=scaler.fit_transform(df[num_cols])

    return df 
   
