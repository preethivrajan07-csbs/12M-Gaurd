import pandas as pd
import xgboost as xgb
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
)
import pickle
import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))

from backend.ml.feature_engineering import FeatureEngineering
from backend.ml.preprocess import DataPreprocessor
from backend.ml.explainability import ModelExplainer


def train_model():

    print("Loading dataset...")
    df = pd.read_csv("../datasets/loan_default.csv")

    print(f"Dataset shape: {df.shape}")
    print(f"Default rate: {df['default_flag'].mean():.2%}")

    # ---------------- Feature Engineering ----------------
    print("Applying feature engineering...")
    fe = FeatureEngineering()
    df = fe.create_derived_features(df)
    df = fe.encode_categorical_features(df)

    # ---------------- Preprocessing ----------------
    print("Preprocessing data...")
    preprocessor = DataPreprocessor()

    X, y = preprocessor.preprocess_data(df)

    X_train, X_test, y_train, y_test = preprocessor.split_data(X, y)

    # DEBUG
    print("\nColumn Data Types")
    print(X_train.dtypes)

    print("\nNon Numeric Columns")
    print(X_train.select_dtypes(exclude=["number"]).columns.tolist())

    for col in X_train.select_dtypes(exclude=["number"]).columns:
        print(col, X_train[col].unique())

    X_train_scaled, X_test_scaled = preprocessor.scale_features(
        X_train, X_test
    )

    preprocessor.save_preprocessors()

    feature_names = X.columns.tolist()

    print(f"Number of features : {len(feature_names)}")

    # ---------------- Model ----------------

    param_grid = {
        "n_estimators": [100, 200],
        "max_depth": [3, 5],
        "learning_rate": [0.01, 0.1],
    }

    model = xgb.XGBClassifier(
        random_state=42,
        objective="binary:logistic",
        eval_metric="auc",
    )

    grid = GridSearchCV(
        model,
        param_grid,
        cv=5,
        scoring="roc_auc",
        verbose=1,
        n_jobs=-1,
    )

    grid.fit(X_train_scaled, y_train)

    best_model = grid.best_estimator_

    print("Best Parameters :", grid.best_params_)

    # ---------------- Evaluation ----------------

    y_pred = best_model.predict(X_test_scaled)
    y_prob = best_model.predict_proba(X_test_scaled)[:, 1]

    print("Accuracy :", accuracy_score(y_test, y_pred))
    print("Precision :", precision_score(y_test, y_pred))
    print("Recall :", recall_score(y_test, y_pred))
    print("F1 :", f1_score(y_test, y_pred))
    print("ROC AUC :", roc_auc_score(y_test, y_prob))

    print(classification_report(y_test, y_pred))

    # ---------------- Save Model ----------------

    os.makedirs("../models", exist_ok=True)
    os.makedirs("../../backend/models", exist_ok=True)

    with open("../models/xgboost.pkl", "wb") as f:
        pickle.dump(best_model, f)

    with open("../../backend/models/model.pkl", "wb") as f:
        pickle.dump(best_model, f)

    # ---------------- SHAP ----------------

    explainer = ModelExplainer(best_model, "../models")
    explainer.fit_explainer(X_train_scaled, feature_names)

    print("Training Completed Successfully")

    return best_model


if __name__ == "__main__":
    train_model()