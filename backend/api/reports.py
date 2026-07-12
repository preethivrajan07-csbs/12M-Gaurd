from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import pandas as pd
from datetime import datetime
import os

router = APIRouter()

# =====================================================
# FILE PATH
# =====================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, "database", "sample_data.csv")


def load_data():
    """Load customer data safely."""
    if not os.path.exists(CSV_PATH):
        raise FileNotFoundError(f"CSV file not found: {CSV_PATH}")

    df = pd.read_csv(CSV_PATH)

    # Clean customer IDs
    df["customer_id"] = df["customer_id"].astype(str).str.strip()

    return df


# =====================================================
# EXPORT EXCEL / CSV DATA
# Keep static routes before dynamic customer route
# =====================================================

@router.get("/reports/export/excel")
async def export_excel(
    report_type: str = "portfolio",
    customer_id: str = None
) -> Dict[str, Any]:

    try:
        df = load_data()

        if report_type == "customer":

            if not customer_id:
                raise HTTPException(
                    status_code=400,
                    detail="Customer ID is required"
                )

            customer_id = customer_id.strip()

            export_df = df[
                df["customer_id"] == customer_id
            ]

            if export_df.empty:
                raise HTTPException(
                    status_code=404,
                    detail=f"Customer {customer_id} not found"
                )

        elif report_type == "high_risk":

            export_df = df[
                df["credit_score"] < 650
            ]

        else:
            export_df = df

        return {
            "success": True,
            "data": export_df.to_dict("records"),
            "filename": (
                f"{report_type}_report_"
                f"{datetime.now().strftime('%Y%m%d')}.xlsx"
            ),
            "report_type": report_type
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to export Excel: {str(e)}"
        )


# =====================================================
# PORTFOLIO REPORT
# =====================================================

@router.get("/reports/portfolio")
async def get_portfolio_report() -> Dict[str, Any]:

    try:
        df = load_data()

        # Group by loan type
        by_loan_type = {}

        for loan_type, group in df.groupby("loan_type"):

            by_loan_type[str(loan_type)] = {
                "customer_id": {
                    "count": int(len(group))
                },
                "loan_amount": {
                    "sum": float(group["loan_amount"].sum()),
                    "mean": float(group["loan_amount"].mean())
                }
            }

        # Group by branch
        by_branch = {}

        for branch, group in df.groupby("branch"):

            by_branch[str(branch)] = {
                "customer_id": {
                    "count": int(len(group))
                },
                "loan_amount": {
                    "sum": float(group["loan_amount"].sum()),
                    "mean": float(group["loan_amount"].mean())
                }
            }

        report = {
            "generated_date":
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

            "summary": {
                "total_loans":
                    int(len(df)),

                "total_portfolio_value":
                    float(df["loan_amount"].sum()),

                "average_loan_amount":
                    float(df["loan_amount"].mean()),

                "default_rate":
                    float(df["default_flag"].mean() * 100),

                "average_credit_score":
                    float(df["credit_score"].mean())
            },

            "risk_distribution": {
                "high_risk":
                    int(len(df[df["credit_score"] < 650])),

                "medium_risk":
                    int(
                        len(
                            df[
                                (df["credit_score"] >= 650) &
                                (df["credit_score"] < 720)
                            ]
                        )
                    ),

                "low_risk":
                    int(len(df[df["credit_score"] >= 720]))
            },

            "by_loan_type": by_loan_type,

            "by_branch": by_branch
        }

        return {
            "success": True,
            "data": report
        }

    except Exception as e:

        print("PORTFOLIO REPORT ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate portfolio report: {str(e)}"
        )


# =====================================================
# CUSTOMER REPORT
# Dynamic route kept after static routes
# =====================================================

@router.get("/reports/customer/{customer_id}")
async def get_customer_report(
    customer_id: str
) -> Dict[str, Any]:

    try:
        df = load_data()

        customer_id = customer_id.strip()

        customer = df[
            df["customer_id"] == customer_id
        ]

        if customer.empty:
            raise HTTPException(
                status_code=404,
                detail=f"Customer {customer_id} not found"
            )

        cust_data = customer.iloc[0]

        report = {
            "customer_id": customer_id,

            "generated_date":
                datetime.now().strftime("%Y-%m-%d %H:%M:%S"),

            "customer_details": {
                "credit_score":
                    int(cust_data["credit_score"]),

                "income":
                    float(cust_data["income"]),

                "employment_length":
                    int(cust_data["employment_length"]),

                "home_ownership":
                    str(cust_data["home_ownership"])
            },

            "loan_details": {
                "loan_amount":
                    float(cust_data["loan_amount"]),

                "interest_rate":
                    float(cust_data["interest_rate"]),

                "loan_term":
                    int(cust_data["loan_term"]),

                "loan_purpose":
                    str(cust_data["loan_purpose"]),

                "monthly_payment":
                    float(cust_data["monthly_payment"]),

                "remaining_balance":
                    float(cust_data["remaining_balance"])
            },

            "risk_assessment": {
                "payment_history":
                    str(cust_data["payment_history"]),

                "missed_payments":
                    int(cust_data["missed_payments"]),

                "debt_to_income":
                    float(cust_data["debt_to_income"]),

                "account_age":
                    int(cust_data["account_age"]),

                "existing_loans":
                    int(cust_data["existing_loans"])
            },

            "branch":
                str(cust_data["branch"]),

            "loan_type":
                str(cust_data["loan_type"])
        }

        return {
            "success": True,
            "data": report
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate customer report: {str(e)}"
        )


# =====================================================
# EXPORT PDF DATA
# =====================================================

@router.get("/reports/export/pdf")
async def export_pdf(
    report_type: str = "portfolio",
    customer_id: str = None
) -> Dict[str, Any]:

    try:

        if report_type == "portfolio":

            report = await get_portfolio_report()

        elif report_type == "customer":

            if not customer_id:
                raise HTTPException(
                    status_code=400,
                    detail="Customer ID is required"
                )

            report = await get_customer_report(customer_id)

        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid report type"
            )

        return {
            "success": True,
            "data": report["data"],
            "filename": (
                f"{report_type}_report_"
                f"{datetime.now().strftime('%Y%m%d')}.pdf"
            ),
            "report_type": report_type
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to export PDF: {str(e)}"
        )