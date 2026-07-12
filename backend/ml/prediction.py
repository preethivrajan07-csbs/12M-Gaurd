import pandas as pd
import numpy as np
import pickle
import shap
import os
from typing import Dict, Any, List
from sklearn.preprocessing import StandardScaler
from ml.feature_engineering import FeatureEngineering
from ml.explainability import ModelExplainer

class PredictionService:
    """Service for making predictions using trained ML model"""
    
    def __init__(self):
        # Get absolute path of backend/models
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.model_dir = os.path.join(base_dir, "models")

        self.model = None
        self.scaler = None
        self.feature_columns = None
        self.explainer = None
        self.feature_engineering = FeatureEngineering()

        self._load_model()
    def _load_model(self):
        """Load trained model and preprocessors"""

        model_path = os.path.join(self.model_dir, "model.pkl")
        scaler_path = os.path.join(self.model_dir, "scaler.pkl")
        feature_columns_path = os.path.join(self.model_dir, "feature_columns.pkl")

        print("Current Directory :", os.getcwd())
        print("Model Directory   :", self.model_dir)
        print("Model Path        :", model_path)

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model not found at {model_path}")

        # Load model
        with open(model_path, "rb") as f:
            self.model = pickle.load(f)

        # Load scaler
        with open(scaler_path, "rb") as f:
            self.scaler = pickle.load(f)

        # Load feature columns
        with open(feature_columns_path, "rb") as f:
            self.feature_columns = pickle.load(f)

        # Initialize SHAP explainer
        self.explainer = ModelExplainer(self.model, self.model_dir)
        self.explainer.feature_names = self.feature_columns
        self.explainer.explainer = shap.TreeExplainer(self.model)

        print("Model loaded successfully!")
        
    def preprocess_input(self, input_data: Dict[str, Any]) -> np.ndarray:
        """Preprocess input data for prediction"""
        # Convert to DataFrame
        df = pd.DataFrame([input_data])
        
        # Apply feature engineering
        df = self.feature_engineering.create_derived_features(df)
        df = self.feature_engineering.encode_categorical_features(df)
        
        # Select features
        available_features = [col for col in self.feature_columns if col in df.columns]
        df = df[available_features]
        
        # Scale features
        scaled_data = self.scaler.transform(df)
        
        return scaled_data
    
    def predict(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Make prediction for a single customer"""
        try:
            # Preprocess input
            X = self.preprocess_input(input_data)
            
            # Get prediction probability
            prob_default = self.model.predict_proba(X)[0][1]
            
            # Get prediction class
            prediction = self.model.predict(X)[0]
            
            # Calculate risk score (0-100)
            risk_score = int(prob_default * 100)
            
            # Determine risk level
            if risk_score >= 70:
                risk_level = "HIGH"
            elif risk_score >= 40:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"
            
            # Get SHAP explanation
            explanation = self.explainer.explain_prediction(X)
            
            # Generate recommendation
            recommendation = self._generate_recommendation(risk_level, explanation['top_risk_factors'])
            
            return {
    "probability_of_default": float(round(float(prob_default) * 100, 2)),
    "risk_score": int(risk_score),
    "risk_level": str(risk_level),
    "prediction": int(prediction),
    "top_risk_factors": explanation["top_risk_factors"],
    "recommendation": str(recommendation)
}
        
        except Exception as e:
            raise Exception(f"Prediction failed: {str(e)}")
    
    def _generate_recommendation(self, risk_level: str, risk_factors: List[Dict]) -> str:
        """Generate action recommendation based on risk level and factors"""
        if risk_level == "HIGH":
            return "IMMEDIATE ACTION REQUIRED: Contact customer for restructuring, increase monitoring frequency, consider collateral review."
        elif risk_level == "MEDIUM":
            return "MONITOR CLOSELY: Schedule follow-up call, review payment capacity, consider early intervention strategies."
        else:
            return "MAINTAIN STANDARD MONITORING: Continue regular payment tracking, no immediate action required."
    
    def batch_predict(self, input_data_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Make predictions for multiple customers"""
        results = []
        for input_data in input_data_list:
            result = self.predict(input_data)
            results.append(result)
        return results
