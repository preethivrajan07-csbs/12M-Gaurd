import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { FileText, Download, FileSpreadsheet, Printer, Calendar, Building2, User } from 'lucide-react';
import { getCustomerReport, getPortfolioReport, exportExcel, exportPdf } from '../services/api';

const Reports = () => {
  const [reportType, setReportType] = useState('portfolio');
  const [customerId, setCustomerId] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      if (reportType === 'customer' && customerId) {
        const response = await getCustomerReport(customerId);
        setReportData(response.data.data);
      } else if (reportType === 'portfolio') {
        const response = await getPortfolioReport();
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await exportExcel(reportType, customerId);
      const data = response.data.data;
      
      // Create CSV content
      const headers = Object.keys(data[0] || {}).join(',');
      const rows = data.map(row => Object.values(row).join(',')).join('\n');
      const csvContent = headers + '\n' + rows;
      
      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Excel:', error);
      alert('Failed to export Excel');
    }
  };

  const handleExportPdf = async () => {
    try {
      const response = await exportPdf(reportType, customerId);
      const data = response.data.data;
      
      // Create simple text content for PDF
      let content = `12M Guard - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report\n`;
      content += `Generated: ${new Date().toLocaleString()}\n\n`;
      
      if (reportType === 'portfolio') {
        content += `Total Loans: ${data.summary?.total_loans}\n`;
        content += `Total Portfolio Value: ₹${data.summary?.total_portfolio_value?.toLocaleString()}\n`;
        content += `Default Rate: ${data.summary?.default_rate}%\n`;
        content += `Average Credit Score: ${data.summary?.average_credit_score}\n\n`;
        content += `Risk Distribution:\n`;
        content += `High Risk: ${data.risk_distribution?.high_risk}\n`;
        content += `Medium Risk: ${data.risk_distribution?.medium_risk}\n`;
        content += `Low Risk: ${data.risk_distribution?.low_risk}\n`;
      } else {
        content += `Customer ID: ${data.customer_id}\n`;
        content += `Credit Score: ${data.customer_details?.credit_score}\n`;
        content += `Income: ₹${data.customer_details?.income?.toLocaleString()}\n`;
        content += `Loan Amount: ₹${data.loan_details?.loan_amount?.toLocaleString()}\n`;
      }
      
      // Download as text file (simplified PDF)
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF');
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
            <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
            <p className="text-gray-600 mt-2">Generate and export comprehensive reports</p>
          </div>

          {/* Report Configuration */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold mb-4">Report Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => {
                    setReportType(e.target.value);
                    setReportData(null);
                  }}
                  className="input-field"
                >
                  <option value="portfolio">Portfolio Report</option>
                  <option value="customer">Customer Report</option>
                </select>
              </div>

              {reportType === 'customer' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="Enter Customer ID"
                    className="input-field"
                  />
                </div>
              )}

              <div className="flex items-end">
                <button
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Generating...</span>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      <span>Generate Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {reportData && (
            <div className="space-y-6">
              {/* Export Actions */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Export Options</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={handleExportExcel}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <FileSpreadsheet className="h-5 w-5" />
                    <span>Export Excel</span>
                  </button>
                  <button
                    onClick={handleExportPdf}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <Printer className="h-5 w-5" />
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>

              {/* Report Content */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Report Preview</h3>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {reportType === 'portfolio' ? (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Portfolio Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Total Loans</p>
                          <p className="text-2xl font-bold">{reportData.summary?.total_loans}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Portfolio Value</p>
                          <p className="text-2xl font-bold">
                            ₹{reportData.summary?.total_portfolio_value?.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <p className="text-sm text-gray-600">Default Rate</p>
                          <p className="text-2xl font-bold">{reportData.summary?.default_rate}%</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-600">Avg Credit Score</p>
                          <p className="text-2xl font-bold">{reportData.summary?.average_credit_score}</p>
                        </div>
                      </div>
                    </div>

                    {/* Risk Distribution */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Risk Distribution</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-red-50 rounded-lg text-center">
                          <p className="text-sm text-gray-600">High Risk</p>
                          <p className="text-3xl font-bold text-red-600">
                            {reportData.risk_distribution?.high_risk}
                          </p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Medium Risk</p>
                          <p className="text-3xl font-bold text-yellow-600">
                            {reportData.risk_distribution?.medium_risk}
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg text-center">
                          <p className="text-sm text-gray-600">Low Risk</p>
                          <p className="text-3xl font-bold text-green-600">
                            {reportData.risk_distribution?.low_risk}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* By Loan Type */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">By Loan Type</h4>
                      <div className="space-y-2">
                        {Object.entries(reportData.by_loan_type || {}).map(([type, data]) => (
                          <div key={type} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">{type}</span>
                            <div className="flex space-x-6">
                              <span>Count: {data.customer_id?.count || 0}</span>
                              <span>Amount: ₹{(data.loan_amount?.sum || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* By Branch */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">By Branch</h4>
                      <div className="space-y-2">
                        {Object.entries(reportData.by_branch || {}).map(([branch, data]) => (
                          <div key={branch} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                            <span className="font-medium">{branch}</span>
                            <div className="flex space-x-6">
                              <span>Count: {data.customer_id?.count || 0}</span>
                              <span>Amount: ₹{(data.loan_amount?.sum || 0).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Customer Details */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Customer Details</span>
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Customer ID</p>
                          <p className="text-xl font-bold">{reportData.customer_id}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Credit Score</p>
                          <p className="text-xl font-bold">{reportData.customer_details?.credit_score}</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-600">Income</p>
                          <p className="text-xl font-bold">
                            ₹{reportData.customer_details?.income?.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">Employment</p>
                          <p className="text-xl font-bold">
                            {reportData.customer_details?.employment_length} years
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Loan Details */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>Loan Details</span>
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Loan Amount</p>
                          <p className="text-xl font-bold">
                            ₹{reportData.loan_details?.loan_amount?.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Interest Rate</p>
                          <p className="text-xl font-bold">{reportData.loan_details?.interest_rate}%</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-600">Loan Term</p>
                          <p className="text-xl font-bold">{reportData.loan_details?.loan_term} months</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">Monthly Payment</p>
                          <p className="text-xl font-bold">
                            ₹{reportData.loan_details?.monthly_payment?.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <p className="text-sm text-gray-600">Remaining Balance</p>
                          <p className="text-xl font-bold">
                            ₹{reportData.loan_details?.remaining_balance?.toLocaleString()}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <p className="text-sm text-gray-600">Loan Purpose</p>
                          <p className="text-xl font-bold">{reportData.loan_details?.loan_purpose}</p>
                        </div>
                      </div>
                    </div>

                    {/* Risk Assessment */}
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-3">Risk Assessment</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Payment History</p>
                          <p className="text-xl font-bold">{reportData.risk_assessment?.payment_history}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                          <p className="text-sm text-gray-600">Missed Payments</p>
                          <p className="text-xl font-bold">{reportData.risk_assessment?.missed_payments}</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-gray-600">Debt-to-Income</p>
                          <p className="text-xl font-bold">
                            {(reportData.risk_assessment?.debt_to_income * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Existing Loans</p>
                          <p className="text-xl font-bold">{reportData.risk_assessment?.existing_loans}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
