import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerAnalysis from './pages/CustomerAnalysis';
import Prediction from './pages/Prediction';
import PortfolioAnalytics from './pages/PortfolioAnalytics';
import Reports from './pages/Reports';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/customer-analysis"
          element={isAuthenticated ? <CustomerAnalysis /> : <Navigate to="/login" />}
        />
        <Route
          path="/prediction"
          element={isAuthenticated ? <Prediction /> : <Navigate to="/login" />}
        />
        <Route
          path="/portfolio-analytics"
          element={isAuthenticated ? <PortfolioAnalytics /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
        />
        
        {/* Default route */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
