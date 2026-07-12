from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import pandas as pd
import sqlite3
import os
import random
from datetime import datetime, timedelta

router = APIRouter()

# ==========================
# Absolute Paths
# ==========================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASE_PATH = os.path.join(BASE_DIR, "database", "customers.db")
CSV_PATH = os.path.join(BASE_DIR, "database", "sample_data.csv")


def get_db_connection():
    """Create database connection"""
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn


class CustomerResponse(BaseModel):
    customer_id: str
    loan_amount: float
    interest_rate: float
    loan_term: int
    credit_score: int
    income: float
    debt_to_income: float
    employment_length: int
    home_ownership: str
    loan_purpose: str
    payment_history: str
    missed_payments: int
    account_age: int
    existing_loans: int
    savings_balance: float
    monthly_payment: float
    remaining_balance: float
    default_flag: int
    branch: str
    loan_type: str


# ====================================================
# Get Single Customer
# ====================================================

@router.get("/customers/{customer_id}")
async def get_customer(customer_id: str) ->Dict[str, Any]:
    """Get customer details by ID"""

    try:

        # Database First
        if os.path.exists(DATABASE_PATH):

            conn = get_db_connection()
            cursor = conn.cursor()

            cursor.execute(
                "SELECT * FROM customers WHERE customer_id=?",
                (customer_id,)
            )

            row = cursor.fetchone()

            conn.close()

            if row:
                return {
                    "success": True,
                    "data": dict(row)
                }

        # CSV Fallback
        df = pd.read_csv(CSV_PATH)

        customer = df[df["customer_id"] == customer_id]

        if customer.empty:
            raise HTTPException(
                status_code=404,
                detail="Customer not found"
            )

        return {
            "success": True,
            "data": customer.iloc[0].to_dict()
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch customer: {str(e)}"
        )


# ====================================================
# Get All Customers
# ====================================================

@router.get("/customers")
async def get_all_customers(
    limit: int = 100,
    offset: int = 0
) -> Dict[str, Any]:

    try:

        df = pd.read_csv(CSV_PATH)

        total = len(df)

        customers = df.iloc[offset:offset + limit].to_dict("records")

        return {
            "success": True,
            "data": customers,
            "total": total,
            "limit": limit,
            "offset": offset
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch customers: {str(e)}"
        )


# ====================================================
# Transactions
# ====================================================

@router.get("/customers/{customer_id}/transactions")
async def get_customer_transactions(customer_id: str):

    try:

        transactions = []

        today = datetime.now()

        for i in range(10):

            transactions.append({

                "transaction_id": f"TXN{customer_id}{i}",

                "date": (
                    today - timedelta(days=i * 30)
                ).strftime("%Y-%m-%d"),

                "amount": round(
                    random.uniform(1000, 20000),
                    2
                ),

                "type": random.choice([
                    "PAYMENT",
                    "PARTIAL_PAYMENT",
                    "LATE_PAYMENT"
                ]),

                "status": random.choice([
                    "COMPLETED",
                    "PENDING",
                    "FAILED"
                ])

            })

        return {

            "success": True,

            "customer_id": customer_id,

            "data": transactions

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ====================================================
# Loan Details
# ====================================================

@router.get("/customers/{customer_id}/loans")
async def get_customer_loans(customer_id: str):

    try:

        df = pd.read_csv(CSV_PATH)

        customer = df[df["customer_id"] == customer_id]

        if customer.empty:
            raise HTTPException(
                status_code=404,
                detail="Customer not found"
            )

        loan = customer.iloc[0]

        return {

            "success": True,

            "data": {

                "customer_id": customer_id,

                "loan_amount": float(loan["loan_amount"]),

                "interest_rate": float(loan["interest_rate"]),

                "loan_term": int(loan["loan_term"]),

                "monthly_payment": float(loan["monthly_payment"]),

                "remaining_balance": float(
                    loan["remaining_balance"]
                ),

                "loan_purpose": loan["loan_purpose"],

                "loan_type": loan["loan_type"],

                "payment_history": loan["payment_history"],

                "missed_payments": int(
                    loan["missed_payments"]
                ),

                "account_age": int(
                    loan["account_age"]
                ),

                "branch": loan["branch"],

                "start_date": "2023-01-15",

                "end_date": "2026-01-15",

                "next_payment_date": "2026-08-15"

            }

        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch loan details: {str(e)}"
        )