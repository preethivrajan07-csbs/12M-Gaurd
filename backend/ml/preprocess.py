import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
import pickle
import os
from typing import Tuple


class DataPreprocessor:
    """Data preprocessing for ML model training"""

    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
        self.feature_columns = None

    def preprocess_data(
        self,
        df: pd.DataFrame,
        target_column: str = "default_flag"
    ) -> Tuple[pd.DataFrame, pd.Series]:

        df = df.copy()

        # Remove ID columns
        id_columns = [
            "customer_id",
            "Customer_ID",
            "customerid",
            "loan_id",
            "Loan_ID",
            "id",
            "ID"
        ]

        for col in id_columns:
            if col in df.columns:
                df.drop(columns=[col], inplace=True)

        # Separate target
        y = df[target_column]
        X = df.drop(columns=[target_column])

        # Fill numeric missing values
        numeric_cols = X.select_dtypes(include=[np.number]).columns
        if len(numeric_cols) > 0:
            X[numeric_cols] = X[numeric_cols].fillna(
                X[numeric_cols].median()
            )

        # Encode object columns
        categorical_cols = X.select_dtypes(include=["object"]).columns

        for col in categorical_cols:
            X[col] = X[col].fillna(X[col].mode()[0])

            encoder = LabelEncoder()
            X[col] = encoder.fit_transform(X[col].astype(str))
            self.label_encoders[col] = encoder

        # Convert pandas category columns into integer codes
        category_cols = X.select_dtypes(include=["category"]).columns

        for col in category_cols:
            X[col] = X[col].cat.codes

        self.feature_columns = X.columns.tolist()

        return X, y

    def split_data(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        test_size: float = 0.2,
        random_state: int = 42
    ):

        return train_test_split(
            X,
            y,
            test_size=test_size,
            random_state=random_state,
            stratify=y
        )

    def scale_features(self, X_train, X_test):

        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        return X_train_scaled, X_test_scaled

    def save_preprocessors(self, model_dir="backend/models"):

        os.makedirs(model_dir, exist_ok=True)

        with open(os.path.join(model_dir, "scaler.pkl"), "wb") as f:
            pickle.dump(self.scaler, f)

        with open(os.path.join(model_dir, "label_encoder.pkl"), "wb") as f:
            pickle.dump(self.label_encoders, f)

        with open(os.path.join(model_dir, "feature_columns.pkl"), "wb") as f:
            pickle.dump(self.feature_columns, f)

    def load_preprocessors(self, model_dir="backend/models"):

        with open(os.path.join(model_dir, "scaler.pkl"), "rb") as f:
            self.scaler = pickle.load(f)

        with open(os.path.join(model_dir, "label_encoder.pkl"), "rb") as f:
            self.label_encoders = pickle.load(f)

        with open(os.path.join(model_dir, "feature_columns.pkl"), "rb") as f:
            self.feature_columns = pickle.load(f)