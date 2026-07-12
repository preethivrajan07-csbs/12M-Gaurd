from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os
import traceback

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.prediction import PredictionService

router = APIRouter()

prediction_service = None


def get_prediction_service():
    global prediction_service

    if prediction_service is None:
        try:
            prediction_service = PredictionService()
            print("Prediction Service Initialized")
        except Exception as e:
            print("=" * 80)
            print("MODEL LOADING ERROR")
            traceback.print_exc()
            print("=" * 80)

            raise HTTPException(
                status_code=500,
                detail=f"Model not loaded: {str(e)}"
            )

    return prediction_service


class PredictionRequest(BaseModel):
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


@router.post("/predict")
async def predict_default(request: PredictionRequest):

    try:
        service = get_prediction_service()

        input_data = request.dict()

        print("=" * 80)
        print("INPUT DATA")
        print(input_data)
        print("=" * 80)

        result = service.predict(input_data)

        return {
            "success": True,
            "customer_id": request.customer_id,
            "data": result
        }

    except Exception as e:

        print("=" * 80)
        print("API ERROR")
        traceback.print_exc()
        print("ERROR:", str(e))
        print("=" * 80)

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/model/status")
async def model_status():

    try:
        get_prediction_service()

        return {
            "success": True,
            "model_loaded": True,
            "status": "ready"
        }

    except Exception as e:

        print("=" * 80)
        print("MODEL STATUS ERROR")
        traceback.print_exc()
        print("=" * 80)

        return {
            "success": False,
            "model_loaded": False,
            "status": "not_ready",
            "error": str(e)
        }