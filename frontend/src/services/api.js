import axios from 'axios';

const API_BASE_URL = 'https://one2m-gaurd.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard APIs
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getRiskDistribution = () => api.get('/dashboard/risk-distribution');
export const getMonthlyTrends = () => api.get('/dashboard/monthly-trends');
export const getRecentAlerts = () => api.get('/dashboard/recent-alerts');
export const getPortfolioSummary = () => api.get('/dashboard/portfolio-summary');

// Customer APIs
export const getCustomer = (customerId) => api.get(`/customers/${customerId}`);
export const getAllCustomers = (limit = 100, offset = 0) => 
  api.get('/customers', { params: { limit, offset } });
export const getCustomerTransactions = (customerId) => 
  api.get(`/customers/${customerId}/transactions`);
export const getCustomerLoans = (customerId) => 
  api.get(`/customers/${customerId}/loans`);

// Prediction APIs
export const predictDefault = (data) => api.post('/predict', data);
export const getModelStatus = () => api.get('/model/status');

// Report APIs
export const getCustomerReport = (customerId) => 
  api.get(`/reports/customer/${customerId}`);
export const getPortfolioReport = () => api.get('/reports/portfolio');
export const exportExcel = (reportType = 'portfolio', customerId = '') =>
  api.get('/reports/export/excel', {
    params: {
      report_type: reportType,
      customer_id: customerId
    }
  });

export const exportPdf = (reportType = 'portfolio', customerId = '') =>
  api.get('/reports/export/pdf', {
    params: {
      report_type: reportType,
      customer_id: customerId
    }
  });

export default api;
