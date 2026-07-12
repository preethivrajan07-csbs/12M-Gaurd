import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PortfolioChart from '../components/Charts/PortfolioChart';
import { BarChart3, PieChart, TrendingUp, Building2 } from 'lucide-react';
import { getPortfolioSummary } from '../services/api';

const PortfolioAnalytics = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      const response = await getPortfolioSummary();
      setPortfolioData(response.data.data);
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading portfolio analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      <Sidebar />
      
      <div className="ml-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Portfolio Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive analysis of loan portfolio across dimensions</p>
          </div>

          {portfolioData && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card">
                  <div className="flex items-center space-x-3 mb-2">
                    <Building2 className="h-5 w-5 text-banking-primary" />
                    <span className="text-sm text-gray-600">Total Branches</span>
                  </div>
                  <p className="text-3xl font-bold">{Object.keys(portfolioData.by_branch).length}</p>
                </div>
                <div className="card">
                  <div className="flex items-center space-x-3 mb-2">
                    <BarChart3 className="h-5 w-5 text-banking-secondary" />
                    <span className="text-sm text-gray-600">Loan Types</span>
                  </div>
                  <p className="text-3xl font-bold">{Object.keys(portfolioData.by_loan_type).length}</p>
                </div>
                <div className="card">
                  <div className="flex items-center space-x-3 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">Total Exposure</span>
                  </div>
                  <p className="text-3xl font-bold">
                    ₹{Object.values(portfolioData.by_branch).reduce((sum, branch) => 
                      sum + (branch.loan_amount?.sum || 0), 0
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="card">
                  <div className="flex items-center space-x-3 mb-2">
                    <PieChart className="h-5 w-5 text-banking-accent" />
                    <span className="text-sm text-gray-600">Active Loans</span>
                  </div>
                  <p className="text-3xl font-bold">
                    {Object.values(portfolioData.by_branch).reduce((sum, branch) => 
                      sum + (branch.customer_id?.count || 0), 0
                    )}
                  </p>
                </div>
              </div>

              {/* Branch-wise Analysis */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <Building2 className="h-6 w-6" />
                  <span>Branch-wise Analysis</span>
                </h2>
                <PortfolioChart 
                  data={portfolioData.by_branch} 
                  title="Loan Distribution by Branch" 
                />
              </div>

              {/* Loan Type Analysis */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Loan-wise Analysis</span>
                </h2>
                <PortfolioChart 
                  data={portfolioData.by_loan_type} 
                  title="Loan Distribution by Type" 
                />
              </div>

              {/* Detailed Branch Table */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Branch Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Branch</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Total Loans</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Total Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Average Loan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(portfolioData.by_branch).map(([branch, data]) => (
                        <tr key={branch} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{branch}</td>
                          <td className="py-3 px-4">{data.customer_id?.count || 0}</td>
                          <td className="py-3 px-4">
                            ₹{(data.loan_amount?.sum || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            ₹{(data.loan_amount?.mean || 0).toFixed(0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Loan Type Table */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Loan Type Details</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Loan Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Total Loans</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Total Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Average Loan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(portfolioData.by_loan_type).map(([type, data]) => (
                        <tr key={type} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{type}</td>
                          <td className="py-3 px-4">{data.customer_id?.count || 0}</td>
                          <td className="py-3 px-4">
                            ₹{(data.loan_amount?.sum || 0).toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            ₹{(data.loan_amount?.mean || 0).toFixed(0).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalytics;
