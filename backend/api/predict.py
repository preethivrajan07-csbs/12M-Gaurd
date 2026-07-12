from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml.prediction import PredictionService

router = APIRouter()

# Initialize prediction service
prediction_service = None

def get_prediction_service():
    global prediction_service
    if prediction_service is None:
        try:
            prediction_service = PredictionService()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Model not loaded: {str(e)}")
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
async def predict_default(request: PredictionRequest) -> Dict[str, Any]:
    """Predict probability of default for a customer"""
    try:
        service = get_prediction_service()
        
        # Convert request to dictionary
        input_data = request.dict()
        
        # Make prediction
        result = service.predict(input_data)
        
        return {
            "success": True,
            "data": result,
            "customer_id": request.customer_id
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@router.get("/model/status")
async def model_status() -> Dict[str, Any]:
    """Check if model is loaded and ready"""
    try:
        service = get_prediction_service()
        return {
            "success": True,
            "model_loaded": True,
            "status": "ready"
        }
    except Exception as e:
        return {
            "success": False,
            "model_loaded": False,
            "status": "not_ready",
            "error": str(e)
        }
