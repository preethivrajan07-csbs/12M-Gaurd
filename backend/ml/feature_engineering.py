import pandas as pd
import numpy as np
from typing import List


class FeatureEngineering:
    """Feature engineering for loan default prediction"""

    @staticmethod
    def create_derived_features(df: pd.DataFrame) -> pd.DataFrame:
        """Create derived features from raw data"""
        df = df.copy()

        # Payment to income ratio
        df["payment_to_income"] = df["monthly_payment"] / df["income"]

        # Loan to income ratio
        df["loan_to_income"] = df["loan_amount"] / df["income"]

        # Remaining balance ratio
        df["remaining_balance_ratio"] = (
            df["remaining_balance"] / df["loan_amount"]
        )

        # Credit score category (numeric)
        df["credit_score_category"] = pd.cut(
            df["credit_score"],
            bins=[0, 600, 650, 700, 750, 850],
            labels=False,
            include_lowest=True,
        )

        # Risk score
        df["missed_payment_risk"] = (
            df["missed_payments"] / df["account_age"]
        )

        # Employment stability (numeric)
        df["employment_stability"] = pd.cut(
            df["employment_length"],
            bins=[0, 2, 5, 10, 50],
            labels=False,
            include_lowest=True,
        )

        # Savings to loan ratio
        df["savings_to_loan"] = (
            df["savings_balance"] / df["loan_amount"]
        )

        # Total debt burden
        df["total_debt_burden"] = (
            df["debt_to_income"] * (1 + df["existing_loans"])
        )

        return df

    @staticmethod
    def encode_categorical_features(df: pd.DataFrame) -> pd.DataFrame:
        """Encode categorical features"""

        df = df.copy()

        home_ownership_map = {
            "RENT": 0,
            "MORTGAGE": 1,
            "OWN": 2,
        }

        payment_history_map = {
            "POOR": 0,
            "FAIR": 1,
            "GOOD": 2,
            "EXCELLENT": 3,
        }

        loan_purpose_map = {
            "PERSONAL": 0,
            "HOME_IMPROVEMENT": 1,
            "BUSINESS": 2,
            "EDUCATION": 3,
        }

        df["home_ownership_encoded"] = df["home_ownership"].map(
            home_ownership_map
        )

        df["payment_history_encoded"] = df["payment_history"].map(
            payment_history_map
        )

        df["loan_purpose_encoded"] = df["loan_purpose"].map(
            loan_purpose_map
        )

        # Remove original text columns
        df.drop(
            columns=[
                "home_ownership",
                "payment_history",
                "loan_purpose",
            ],
            inplace=True,
            errors="ignore",
        )

        return df

    @staticmethod
    def select_features(df: pd.DataFrame) -> List[str]:
        """Select relevant features"""

        feature_columns = [
            "loan_amount",
            "interest_rate",
            "loan_term",
            "credit_score",
            "income",
            "debt_to_income",
            "employment_length",
            "missed_payments",
            "account_age",
            "existing_loans",
            "savings_balance",
            "monthly_payment",
            "remaining_balance",
            "payment_to_income",
            "loan_to_income",
            "remaining_balance_ratio",
            "credit_score_category",
            "employment_stability",
            "missed_payment_risk",
            "savings_to_loan",
            "total_debt_burden",
            "home_ownership_encoded",
            "payment_history_encoded",
            "loan_purpose_encoded",
        ]

        return [col for col in feature_columns if col in df.columns]