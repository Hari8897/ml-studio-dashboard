from optparse import Option
from numpy._core.multiarray import scalar
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler, StandardScaler, LabelEncoder


def generate_dataset_overview(df):
    total_rows = len(df)
    total_columns = len(df.columns)

    total_cells = total_rows + total_columns

    missing_cells = df.isna().sum().sum()

    missing_percentage = (
        (missing_cells/total_cells)* 100 
        if total_cells >0
        else 0
    )

    categorical_columns = len(df.select_dtypes(include = ['object',"category"]).columns)
    numerical_columns = len(df.select_dtypes(include = ["number"]).columns) 

    duplicate_rows = df.duplicated().sum()

    duplicate_percentage = (
        (duplicate_rows / total_rows) * 100
        if total_rows >0
        else 0
    )

    columns = []
    
    for column in df.columns:
        if pd.api.types.is_numeric_dtype(df[column]):
            data_type = "numerical"
        else: 
            data_type = "categorical"

        sample_values = (
            df[column].dropna().head(3).tolist()
        )
        columns.append({
            "name": column,
            "data_type": data_type,
            "missing_values": int(df[column].isna().sum()),
            "unique": int(df[column].nunique(dropna=True)),
            "sample_values": sample_values
        })

    return {
        "total_rows": total_rows,
        "total_columns":total_columns,
        "missing_percentage": round(missing_percentage,2),
        "categorical_columns": categorical_columns,
        "numerical_columns": numerical_columns,
        "duplicate_percentage" : round(duplicate_percentage, 2),
        "columns": columns
    }

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


def preprocessTarget(target, options):
    target_df = pd.DataFrame(target)

    if target_df.empty:
        return target_df

    missing_num = options.get("missing_num") or options.get("missing")
    missing_cat = options.get("missing_cat")

    if missing_num == "drop" or missing_cat == "drop":
        target_df = target_df.dropna()
    elif missing_num == "mean":
        for col in target_df.select_dtypes(include='number').columns:
            target_df[col] = target_df[col].fillna(target_df[col].mean())
    elif missing_num == "median":
        for col in target_df.select_dtypes(include='number').columns:
            target_df[col] = target_df[col].fillna(target_df[col].median())
    elif missing_num == "zero":
        target_df = target_df.fillna(0)

    if missing_cat == "mode":
        for col in target_df.select_dtypes(include='object').columns:
            mode = target_df[col].mode(dropna=True)
            if not mode.empty:
                target_df[col] = target_df[col].fillna(mode.iloc[0])

    for col in target_df.select_dtypes(include=['object', 'category', 'bool']).columns:
        target_df[col] = LabelEncoder().fit_transform(target_df[col].astype(str))

    return target_df
   
