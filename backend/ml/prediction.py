import os
import pickle
import traceback
from typing import Dict, Any

import numpy as np
import pandas as pd
import shap

from ml.feature_engineering import FeatureEngineering
from ml.explainability import ModelExplainer


class PredictionService:
    """Prediction Service"""

    def __init__(self):

        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.model_dir = os.path.join(base_dir, "models")

        self.model = None
        self.scaler = None
        self.feature_columns = None

        self.feature_engineering = FeatureEngineering()
        self.explainer = None

        self._load_model()

    def _load_model(self):

        model_path = os.path.join(self.model_dir, "model.pkl")
        scaler_path = os.path.join(self.model_dir, "scaler.pkl")
        feature_path = os.path.join(self.model_dir, "feature_columns.pkl")

        print("=" * 70)
        print("Loading Model...")
        print(model_path)
        print("=" * 70)

        with open(model_path, "rb") as f:
            self.model = pickle.load(f)

        with open(scaler_path, "rb") as f:
            self.scaler = pickle.load(f)

        with open(feature_path, "rb") as f:
            self.feature_columns = pickle.load(f)

        try:
            self.explainer = ModelExplainer(self.model, self.model_dir)
            self.explainer.feature_names = self.feature_columns
            self.explainer.explainer = shap.TreeExplainer(self.model)
            print("SHAP initialized successfully")
        except Exception as e:
            print("SHAP ERROR:", str(e))
            self.explainer = None

        print("Model Loaded Successfully")

    def preprocess_input(self, input_data: Dict[str, Any]):

        df = pd.DataFrame([input_data])

        print("Original Columns")
        print(df.columns.tolist())

        df = self.feature_engineering.create_derived_features(df)
        df = self.feature_engineering.encode_categorical_features(df)

        print("After Feature Engineering")
        print(df.columns.tolist())

        # Add missing columns
        for col in self.feature_columns:
            if col not in df.columns:
                df[col] = 0

        # Keep correct order
        df = df[self.feature_columns]

        # Convert to numeric
        df = df.apply(pd.to_numeric, errors="coerce")

        # Replace NaN
        df = df.fillna(0)

        print("Final Feature Shape:", df.shape)

        X = self.scaler.transform(df)

        return X

    def predict(self, input_data: Dict[str, Any]):

        try:

            X = self.preprocess_input(input_data)

            probability = float(self.model.predict_proba(X)[0][1])

            prediction = int(self.model.predict(X)[0])

            risk_score = int(probability * 100)

            if risk_score >= 70:
                risk_level = "HIGH"
            elif risk_score >= 40:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"

            top_factors = []

            if self.explainer is not None:
                try:
                    explanation = self.explainer.explain_prediction(X)
                    top_factors = explanation.get("top_risk_factors", [])
                except Exception as e:
                    print("SHAP Prediction Error:", str(e))
                    top_factors = []

            recommendation = self._generate_recommendation(
                risk_level,
                top_factors
            )

            return {
                "probability_of_default": round(probability * 100, 2),
                "risk_score": risk_score,
                "risk_level": risk_level,
                "prediction": prediction,
                "top_risk_factors": top_factors,
                "recommendation": recommendation
            }

        except Exception as e:

            print("=" * 80)
            traceback.print_exc()
            print("=" * 80)

            raise Exception(str(e))

    def _generate_recommendation(self, risk_level, risk_factors):

        if risk_level == "HIGH":
            return (
                "IMMEDIATE ACTION REQUIRED: Contact customer immediately and review loan."
            )

        elif risk_level == "MEDIUM":
            return (
                "Monitor customer closely and schedule follow-up."
            )

        else:
            return (
                "Customer is low risk. Continue normal monitoring."
            )

    def batch_predict(self, input_data_list):

        results = []

        for item in input_data_list:
            results.append(self.predict(item))

        return results