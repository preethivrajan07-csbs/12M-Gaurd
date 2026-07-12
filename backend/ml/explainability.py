import shap
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from typing import Dict, List, Any
import joblib
import os

class ModelExplainer:
    """SHAP-based model explainability"""
    
    def __init__(self, model, model_dir: str = 'backend/models'):
        self.model = model
        self.model_dir = model_dir
        self.explainer = None
        self.shap_values = None
        self.feature_names = None
    
    def fit_explainer(self, X_background: np.ndarray, feature_names: List[str]):
        """Fit SHAP explainer with background data"""
        self.feature_names = feature_names
        self.explainer = shap.TreeExplainer(self.model)
        self.shap_values = self.explainer.shap_values(X_background)
        
        # Save SHAP values
        os.makedirs(self.model_dir, exist_ok=True)
        joblib.dump(self.shap_values, os.path.join(self.model_dir, 'shap_values.pkl'))
    
    def explain_prediction(self, instance):
        """Explain a single prediction"""

        if self.explainer is None:
            raise ValueError("Explainer not initialized.")

        shap_values = self.explainer.shap_values(instance)

        # Handle different SHAP output formats
        if isinstance(shap_values, list):
            shap_values = shap_values[0]

        if len(shap_values.shape) == 2:
            values = shap_values[0]
        else:
            values = shap_values

        feature_importance = {}

        for i, name in enumerate(self.feature_names):
            feature_importance[name] = float(abs(values[i]))

        sorted_features = sorted(
            feature_importance.items(),
            key=lambda x: x[1],
            reverse=True
        )

        top_risk_factors = [
    {
        "feature": str(name),
        "importance": float(value)
    }
    for name, value in sorted_features[:5]
]

        base = self.explainer.expected_value

        if isinstance(base, (list, np.ndarray)):
            base = base[0]

        return {
            "shap_values": values.tolist(),
            "top_risk_factors": top_risk_factors,
            "base_value": float(base)
        }
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get global feature importance"""
        if self.shap_values is None:
            raise ValueError("SHAP values not calculated. Call fit_explainer first.")
        
        # Calculate mean absolute SHAP values
        mean_shap = np.abs(self.shap_values).mean(axis=0)
        
        feature_importance = {}
        for i, name in enumerate(self.feature_names):
            feature_importance[name] = float(mean_shap[i])
        
        return feature_importance
    
    def generate_summary_plot(self, output_path: str = None):
        """Generate SHAP summary plot"""
        if self.shap_values is None:
            raise ValueError("SHAP values not calculated. Call fit_explainer first.")
        
        plt.figure(figsize=(10, 8))
        shap.summary_plot(self.shap_values, feature_names=self.feature_names, show=False)
        
        if output_path:
            plt.savefig(output_path, bbox_inches='tight')
            plt.close()
        else:
            plt.show()
