import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RiskCard from '../components/RiskCard';
import AlertCard from '../components/AlertCard';
import RiskDistributionChart from '../components/Charts/RiskDistributionChart';
import MonthlyTrendChart from '../components/Charts/MonthlyTrendChart';
import { 
  Building2, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  Activity 
} from 'lucide-react';
import { 
  getDashboardStats, 
  getRiskDistribution, 
  getMonthlyTrends, 
  getRecentAlerts 
} from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [riskDistribution, setRiskDistribution] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [statsRes, riskRes, trendsRes, alertsRes] = await Promise.all([
        getDashboardStats(),
        getRiskDistribution(),
        getMonthlyTrends(),
        getRecentAlerts()
      ]);

      setStats(statsRes?.data?.data || {});
setRiskDistribution(riskRes?.data?.data || []);
setMonthlyTrends(trendsRes?.data?.data || []);
setAlerts(alertsRes?.data?.data || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-banking-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
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
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-2">Overview of loan portfolio and risk metrics</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <RiskCard
                title="Total Active Loans"
                value={stats.total_active_loans}
                icon={Building2}
                color="primary"
                trend={5.2}
              />
              <RiskCard
                title="High Risk"
                value={stats.high_risk}
                icon={AlertTriangle}
                color="danger"
                trend={-2.1}
              />
              <RiskCard
                title="Medium Risk"
                value={stats.medium_risk}
                icon={Activity}
                color="warning"
                trend={1.8}
              />
              <RiskCard
                title="Low Risk"
                value={stats.low_risk}
                icon={Shield}
                color="success"
                trend={3.5}
              />
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {riskDistribution && (
              <RiskDistributionChart data={riskDistribution} />
            )}
            {monthlyTrends && (
              <MonthlyTrendChart data={monthlyTrends} />
            )}
          </div>

          {/* Recent Alerts */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Alerts</h2>
            <div className="space-y-3">
              {(alerts || []).slice(0, 5).map((alert, index) => (
                <AlertCard key={index} alert={alert} />
              ))}
            </div>
          </div>

          {/* Additional Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold mb-2">Total Portfolio Value</h3>
                <p className="text-3xl font-bold text-banking-primary">
                  ₹{(stats.total_portfolio_value || 0).toLocaleString()}
                </p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold mb-2">Default Rate</h3>
                <p className="text-3xl font-bold text-banking-danger">
                  {stats.default_rate || 0}%
                </p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold mb-2">Average Credit Score</h3>
                <p className="text-3xl font-bold text-banking-success">
                  {stats.avg_credit_score || 0}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
