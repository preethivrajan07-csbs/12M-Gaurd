from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os

from api.predict import router as predict_router
from api.customer import router as customer_router
from api.dashboard import router as dashboard_router
from api.reports import router as reports_router

app = FastAPI(
    title="12M Guard - AI-Powered Early Warning System",
    description="Banking API for predicting loan defaults up to 12 months in advance",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict_router, prefix="/api", tags=["Prediction"])
app.include_router(customer_router, prefix="/api", tags=["Customer"])
app.include_router(dashboard_router, prefix="/api", tags=["Dashboard"])
app.include_router(reports_router, prefix="/api", tags=["Reports"])

@app.get("/")
async def root():
    return {
        "message": "12M Guard - AI-Powered Early Warning System",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
