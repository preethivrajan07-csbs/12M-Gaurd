import React, { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

const CustomerTable = ({ customers, onCustomerClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('credit_score');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredCustomers = customers.filter(customer =>
    customer.customer_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getRiskColor = (score) => {
    if (score < 650) return 'bg-red-100 text-red-800';
    if (score < 720) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getRiskLevel = (score) => {
    if (score < 650) return 'HIGH';
    if (score < 720) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Customer List</h3>
        <div className="flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-banking-secondary"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-600">
                <button 
                  onClick={() => { setSortField('customer_id'); setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }}
                  className="flex items-center space-x-1"
                >
                  Customer ID <ChevronDown className="h-4 w-4" />
                </button>
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Credit Score</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Loan Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Risk Level</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Branch</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers.map((customer) => (
              <tr key={customer.customer_id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{customer.customer_id}</td>
                <td className="py-3 px-4">{customer.credit_score}</td>
                <td className="py-3 px-4">₹{customer.loan_amount.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(customer.credit_score)}`}>
                    {getRiskLevel(customer.credit_score)}
                  </span>
                </td>
                <td className="py-3 px-4">{customer.branch}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => onCustomerClick(customer.customer_id)}
                    className="text-banking-secondary hover:text-banking-accent font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedCustomers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No customers found matching your search.
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
