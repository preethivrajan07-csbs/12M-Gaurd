from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, List
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/dashboard/stats")
async def get_dashboard_stats() -> Dict[str, Any]:
    """Get dashboard statistics"""
    try:
        df = pd.read_csv("backend/database/sample_data.csv")
        
        total_loans = len(df)
        high_risk = len(df[df['credit_score'] < 650])
        medium_risk = len(df[(df['credit_score'] >= 650) & (df['credit_score'] < 720)])
        low_risk = len(df[df['credit_score'] >= 720])
        
        # Calculate default rate
        default_rate = (df['default_flag'].sum() / total_loans) * 100
        
        return {
            "success": True,
            "data": {
                "total_active_loans": total_loans,
                "high_risk": high_risk,
                "medium_risk": medium_risk,
                "low_risk": low_risk,
                "default_rate": round(default_rate, 2),
                "total_portfolio_value": int(df['loan_amount'].sum()),
                "avg_credit_score": round(df['credit_score'].mean(), 2)
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.get("/dashboard/risk-distribution")
async def get_risk_distribution() -> Dict[str, Any]:
    """Get risk distribution data"""
    try:
        df = pd.read_csv("backend/database/sample_data.csv")
        
        # Categorize by credit score
        def get_risk_category(score):
            if score < 650:
                return "HIGH"
            elif score < 720:
                return "MEDIUM"
            else:
                return "LOW"
        
        df['risk_category'] = df['credit_score'].apply(get_risk_category)
        
        risk_counts = df['risk_category'].value_counts().to_dict()
        
        return {
            "success": True,
            "data": {
                "HIGH": risk_counts.get("HIGH", 0),
                "MEDIUM": risk_counts.get("MEDIUM", 0),
                "LOW": risk_counts.get("LOW", 0)
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.get("/dashboard/monthly-trends")
async def get_monthly_trends() -> Dict[str, Any]:
    """Get monthly default trends"""
    try:
        # Generate mock monthly trend data
        months = []
        defaults = []
        new_loans = []
        
        base_date = datetime.now()
        for i in range(12):
            month_date = base_date - timedelta(days=30 * (11 - i))
            months.append(month_date.strftime("%Y-%m"))
            defaults.append(np.random.randint(5, 25))
            new_loans.append(np.random.randint(50, 150))
        
        return {
            "success": True,
            "data": {
                "months": months,
                "defaults": defaults,
                "new_loans": new_loans
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.get("/dashboard/recent-alerts")
async def get_recent_alerts() -> Dict[str, Any]:
    """Get recent high-risk alerts"""
    try:
        df = pd.read_csv("backend/database/sample_data.csv")
        
        # Get high-risk customers
        high_risk = df[df['credit_score'] < 650].sort_values('credit_score').head(10)
        
        alerts = []
        for _, row in high_risk.iterrows():
            alerts.append({
                "customer_id": row['customer_id'],
                "risk_level": "HIGH",
                "credit_score": int(row['credit_score']),
                "missed_payments": int(row['missed_payments']),
                "remaining_balance": float(row['remaining_balance']),
                "alert_date": datetime.now().strftime("%Y-%m-%d"),
                "reason": f"Low credit score ({row['credit_score']}) and {row['missed_payments']} missed payments"
            })
        
        return {
            "success": True,
            "data": alerts
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

@router.get("/dashboard/portfolio-summary")
async def get_portfolio_summary() -> Dict[str, Any]:
    """Get portfolio summary by loan type and branch"""
    try:
        df = pd.read_csv("backend/database/sample_data.csv")
        
        # Summary by loan type
        loan_type_summary = df.groupby('loan_type').agg({
            'loan_amount': 'sum',
            'customer_id': 'count'
        }).rename(columns={'customer_id': 'count'}).to_dict('index')
        
        # Summary by branch
        branch_summary = df.groupby('branch').agg({
            'loan_amount': 'sum',
            'customer_id': 'count'
        }).rename(columns={'customer_id': 'count'}).to_dict('index')
        
        return {
            "success": True,
            "data": {
                "by_loan_type": loan_type_summary,
                "by_branch": branch_summary
            }
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }
