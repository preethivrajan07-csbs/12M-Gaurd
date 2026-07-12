import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CustomerTable from '../components/CustomerTable';
import { Search, User, CreditCard, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';
import { getCustomer, getAllCustomers, getCustomerTransactions, getCustomerLoans } from '../services/api';

const CustomerAnalysis = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loans, setLoans] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const response = await getAllCustomers(50, 0);
      setCustomers(response.data.data);
    } catch (error) {
      console.error('Error loading customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    try {
      setLoading(true);
      const response = await getCustomer(searchId);
      setCustomerDetails(response.data.data);
      setSelectedCustomer(searchId);
      
      // Load related data
      const [transRes, loansRes] = await Promise.all([
        getCustomerTransactions(searchId),
        getCustomerLoans(searchId)
      ]);
      
      setTransactions(transRes.data.data);
      setLoans(loansRes.data.data);
    } catch (error) {
      console.error('Error searching customer:', error);
      alert('Customer not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerClick = async (customerId) => {
    setSearchId(customerId);
    await handleSearch({ preventDefault: () => {} });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const getRiskColor = (score) => {
    if (score < 650) return 'text-red-600 bg-red-50';
    if (score < 720) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getRiskLevel = (score) => {
    if (score < 650) return 'HIGH';
    if (score < 720) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onLogout={handleLogout} />
      <Sidebar />
      
      <div className="ml-64 pt-16">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Customer Analysis</h1>
            <p className="text-gray-600 mt-2">Search and analyze customer loan details</p>
          </div>

          {/* Search Section */}
          <div className="card mb-8">
            <form onSubmit={handleSearch} className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Customer ID (e.g., CUST001)"
                  className="input-field pl-10"
                />
              </div>
              <button type="submit" className="btn-primary px-8">
                Search Customer
              </button>
            </form>
          </div>

          {selectedCustomer && customerDetails ? (
            /* Customer Details View */
            <div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="flex items-center space-x-2 text-banking-secondary hover:text-banking-accent mb-6"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Customer List</span>
              </button>

              {/* Customer Profile Card */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="card lg:col-span-1">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="p-3 bg-banking-primary rounded-full">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{customerDetails.customer_id}</h2>
                      <p className="text-gray-600">{customerDetails.branch}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Credit Score</span>
                      <span className={`px-3 py-1 rounded-full font-semibold ${getRiskColor(customerDetails.credit_score)}`}>
                        {customerDetails.credit_score}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Risk Level</span>
                      <span className={`px-3 py-1 rounded-full font-semibold ${getRiskColor(customerDetails.credit_score)}`}>
                        {getRiskLevel(customerDetails.credit_score)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Income</span>
                      <span className="font-semibold">₹{customerDetails.income.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Employment</span>
                      <span className="font-semibold">{customerDetails.employment_length} years</span>
                    </div>
                  </div>
                </div>

                {/* Loan Details */}
                {loans && (
                  <div className="card lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Loan Details</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Loan Amount</p>
                        <p className="text-xl font-bold">₹{loans.loan_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Interest Rate</p>
                        <p className="text-xl font-bold">{loans.interest_rate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Loan Term</p>
                        <p className="text-xl font-bold">{loans.loan_term} months</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Monthly Payment</p>
                        <p className="text-xl font-bold">₹{loans.monthly_payment.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Remaining Balance</p>
                        <p className="text-xl font-bold">₹{loans.remaining_balance.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Loan Type</p>
                        <p className="text-xl font-bold">{loans.loan_type}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Risk Indicators */}
              <div className="card mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Risk Indicators</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Payment History</p>
                    <p className="text-lg font-semibold">{customerDetails.payment_history}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Missed Payments</p>
                    <p className="text-lg font-semibold text-red-600">{customerDetails.missed_payments}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Debt-to-Income Ratio</p>
                    <p className="text-lg font-semibold">{(customerDetails.debt_to_income * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Existing Loans</p>
                    <p className="text-lg font-semibold">{customerDetails.existing_loans}</p>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="card">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Transaction History</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Transaction ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((txn) => (
                        <tr key={txn.transaction_id} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium">{txn.transaction_id}</td>
                          <td className="py-3 px-4">{txn.date}</td>
                          <td className="py-3 px-4">₹{txn.amount.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              txn.type === 'PAYMENT' ? 'bg-green-100 text-green-800' :
                              txn.type === 'LATE_PAYMENT' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {txn.type}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              txn.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              txn.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {txn.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* Customer List View */
            <CustomerTable customers={customers} onCustomerClick={handleCustomerClick} />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalysis;
