import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RiskGauge from '../components/RiskGauge';
import RecommendationCard from '../components/RecommendationCard';
import { Brain, AlertCircle, TrendingUp, BarChart3, Loader2 } from 'lucide-react';
import { getCustomer, predictDefault } from '../services/api';

const Prediction = () => {
  const [customerId, setCustomerId] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!customerId.trim()) return;

    try {
      setLoading(true);
      const response = await getCustomer(customerId);
      setCustomerData(response.data.data);
      setPrediction(null);
    } catch (error) {
      console.error('Error searching customer:', error);
      alert('Customer not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    if (!customerData) return;

    try {
      setPredicting(true);
      const response = await predictDefault(customerData);
      setPrediction(response.data.data);
    } catch (error) {
      console.error('Error making prediction:', error);
      alert('Prediction failed. Please ensure the model is trained.');
    } finally {
      setPredicting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      <Sidebar />
      
      <div className="ml-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">AI Prediction</h1>
            <p className="text-gray-600 mt-2">Predict probability of default using XGBoost model</p>
          </div>

          {/* Search Section */}
          <div className="card mb-8">
            <form onSubmit={handleSearch} className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter Customer ID (e.g., CUST001)"
                  className="input-field"
                />
              </div>
              <button type="submit" className="btn-primary px-8" disabled={loading}>
                {loading ? 'Loading...' : 'Load Customer'}
              </button>
            </form>
          </div>

          {customerData && (
            <div className="space-y-6">
              {/* Customer Summary */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Customer Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Customer ID</p>
                    <p className="font-semibold">{customerData.customer_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Credit Score</p>
                    <p className="font-semibold">{customerData.credit_score}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Loan Amount</p>
                    <p className="font-semibold">₹{customerData.loan_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Income</p>
                    <p className="font-semibold">₹{customerData.income.toLocaleString()}</p>
                  </div>
                </div>

                <button
                  onClick={handlePredict}
                  disabled={predicting}
                  className="mt-6 w-full btn-primary py-3 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {predicting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Analyzing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5" />
                      <span>Predict Default Probability</span>
                    </>
                  )}
                </button>
              </div>

              {prediction && (
                <div className="space-y-6">
                  {/* Prediction Results */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Risk Gauge */}
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4 text-center">Risk Assessment</h3>
                      <RiskGauge 
                        riskScore={prediction.risk_score} 
                        riskLevel={prediction.risk_level} 
                      />
                    </div>

                    {/* Probability Display */}
                    <div className="card">
                      <h3 className="text-lg font-semibold mb-4">Default Probability</h3>
                      <div className="text-center">
                        <div className="text-6xl font-bold mb-2" style={{ 
                          color: prediction.risk_level === 'HIGH' ? '#DC3545' : 
                                 prediction.risk_level === 'MEDIUM' ? '#FFC107' : '#28A745' 
                        }}>
                          {prediction.probability_of_default}%
                        </div>
                        <p className="text-gray-600">Probability of Default within 12 months</p>
                      </div>

                      <div className="mt-6 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Risk Score</span>
                          <span className="font-semibold text-2xl">{prediction.risk_score}/100</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Risk Level</span>
                          <span className={`px-3 py-1 rounded-full font-semibold ${
                            prediction.risk_level === 'HIGH' ? 'bg-red-100 text-red-800' :
                            prediction.risk_level === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {prediction.risk_level}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Risk Factors */}
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5" />
                      <span>Top Risk Factors (SHAP Analysis)</span>
                    </h3>
                    <div className="space-y-3">
                      {prediction.top_risk_factors.map((factor, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-banking-primary text-white rounded-full flex items-center justify-center font-semibold">
                              {index + 1}
                            </div>
                            <span className="font-medium capitalize">
                              {factor.feature.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <BarChart3 className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold">{factor.importance.toFixed(4)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendation */}
                  <RecommendationCard recommendation={prediction.recommendation} />

                  {/* Additional Insights */}
                  <div className="card">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>Model Insights</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Model Used</p>
                        <p className="font-semibold">XGBoost Classifier</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Explainability</p>
                        <p className="font-semibold">SHAP Values</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-600">Prediction Horizon</p>
                        <p className="font-semibold">12 Months</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Prediction;
