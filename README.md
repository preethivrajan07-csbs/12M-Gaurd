# 12M Guard – AI-Powered 12-Month Default Prediction & Early Warning System

An enterprise-level banking application that predicts the Probability of Default (PD) for active loan accounts up to 12 months in advance using borrower behaviour, internal bank data, and public-domain data.

## 🏆 Project Overview

12M Guard is a comprehensive AI-powered Early Warning System designed for banks to predict loan defaults with high accuracy. The system uses XGBoost machine learning models with SHAP explainability to provide transparent and actionable insights for risk management.

## 🚀 Features

- **AI-Powered Predictions**: XGBoost-based machine learning model for accurate default prediction
- **SHAP Explainability**: Transparent model explanations with feature importance analysis
- **Real-time Dashboard**: Interactive dashboard with risk metrics and trends
- **Customer Analysis**: Detailed customer profiling with risk indicators
- **Portfolio Analytics**: Comprehensive portfolio analysis by branch and loan type
- **Report Generation**: Export reports in PDF and Excel formats
- **Professional UI**: Enterprise-grade banking interface with IDBI-inspired design
- **REST APIs**: FastAPI backend with comprehensive API endpoints

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Lucide React** - Icons

### Backend
- **Python** - Programming language
- **FastAPI** - Web framework
- **XGBoost** - Machine learning
- **SHAP** - Model explainability
- **Scikit-learn** - ML utilities
- **Pandas** - Data manipulation
- **SQLite** - Database

### Deployment
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
12M-Guard/
├── frontend/                     # React + Vite
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   ├── App.jsx               # Main app with routing
│   │   └── main.jsx              # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
│
├── backend/                      # FastAPI Backend
│   ├── app.py                    # Main application
│   ├── requirements.txt
│   ├── api/                      # API endpoints
│   ├── ml/                       # ML modules
│   ├── models/                   # Trained models
│   ├── database/                 # Database files
│   └── Dockerfile
│
├── ai/                           # ML Training
│   ├── datasets/                 # Training data
│   ├── notebooks/                # Jupyter notebooks
│   ├── models/                   # ML models
│   └── training/                 # Training scripts
│
├── docs/                         # Documentation
├── screenshots/                  # Application screenshots
├── docker-compose.yml
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd 12M-Guard
```

2. **Backend Setup**
```bash
cd backend
pip install -r requirements.txt
```

3. **Train the ML Model**
```bash
cd ../ai/training
python train.py
```

4. **Frontend Setup**
```bash
cd ../frontend
npm install
```

### Running the Application

#### Option 1: Docker (Recommended)

```bash
docker-compose up --build
```

Access the application at `http://localhost:3000`

#### Option 2: Manual Setup

**Start Backend:**
```bash
cd backend
uvicorn app:app --reload
```

**Start Frontend:**
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:3000`

## 🔐 Authentication

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

## 📊 Application Pages

### 1. Login Page
Professional banking login interface with mock authentication.

### 2. Dashboard
- Total Active Loans
- High/Medium/Low Risk counts
- Risk Distribution chart
- Monthly Default Trends
- Recent Alerts

### 3. Customer Analysis
- Search by Customer ID
- Loan Details
- Credit Score
- Repayment History
- Transactions
- Risk Indicators

### 4. AI Prediction
- Predict Default Probability
- Risk Score (0-100)
- Risk Level (High/Medium/Low)
- Top Risk Factors (SHAP)
- Recommended Actions

### 5. Portfolio Analytics
- Loan-wise Analysis
- Branch-wise Analysis
- Monthly Trends
- Interactive Charts

### 6. Reports
- Customer Report generation
- Portfolio Report generation
- Export to PDF
- Export to Excel

## 🔌 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/risk-distribution` - Risk distribution data
- `GET /api/dashboard/monthly-trends` - Monthly trend data
- `GET /api/dashboard/recent-alerts` - Recent high-risk alerts

### Customer
- `GET /api/customers/{id}` - Get customer details
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}/transactions` - Get customer transactions
- `GET /api/customers/{id}/loans` - Get customer loans

### Prediction
- `POST /api/predict` - Predict default probability
- `GET /api/model/status` - Check model status

### Reports
- `GET /api/reports/customer/{id}` - Generate customer report
- `GET /api/reports/portfolio` - Generate portfolio report
- `GET /api/reports/export/excel` - Export Excel
- `GET /api/reports/export/pdf` - Export PDF

## 🤖 Machine Learning Model

### Model Details
- **Algorithm**: XGBoost Classifier
- **Features**: 22 engineered features
- **Explainability**: SHAP (SHapley Additive exPlanations)
- **Prediction Horizon**: 12 months

### Features
- Loan amount, interest rate, term
- Credit score, income, debt-to-income ratio
- Employment length, home ownership
- Payment history, missed payments
- Account age, existing loans
- Savings balance, monthly payment
- Derived features (payment-to-income, loan-to-income, etc.)

### Model Performance
- Accuracy: >80%
- ROC-AUC: >0.85
- Feature importance via SHAP values

## 🎨 Design System

### Colors
- **Primary**: #003366 (Deep Blue)
- **Secondary**: #4A90E2 (Light Blue)
- **Accent**: #0056b3 (Accent Blue)
- **Success**: #28A745 (Green)
- **Warning**: #FFC107 (Yellow)
- **Danger**: #DC3545 (Red)
- **Light**: #F5F5F5 (Light Gray)
- **Dark**: #1a1a2e (Dark Blue)

## 📝 Dataset

The application uses a realistic banking dataset with 100 customer records including:
- Customer demographics
- Loan details
- Credit information
- Payment history
- Risk indicators

## 🔧 Configuration

### Backend Configuration
- Port: 8000
- Database: SQLite
- Model Path: `backend/models/`

### Frontend Configuration
- Port: 3000
- API Proxy: `http://localhost:8000`

## 🐳 Docker Deployment

### Build and Run
```bash
docker-compose up --build
```

### Services
- **Backend**: Port 8000
- **Frontend**: Port 80 (mapped to 3000 on host)

## 📸 Screenshots

Add application screenshots in the `screenshots/` directory:
- dashboard.png
- prediction.png
- analytics.png
- reports.png

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Developed for the IDBI Bank Hackathon

## 🙏 Acknowledgments

- IDBI Bank for the hackathon opportunity
- XGBoost and SHAP libraries
- React and FastAPI communities

## 📞 Support

For support and queries, please contact the development team.

---

**Note**: This is a prototype for demonstration purposes. For production use, additional security measures, data validation, and scalability improvements are required.
