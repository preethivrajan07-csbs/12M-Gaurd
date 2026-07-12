import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerAnalysis from './pages/CustomerAnalysis';
import Prediction from './pages/Prediction';
import PortfolioAnalytics from './pages/PortfolioAnalytics';
import Reports from './pages/Reports';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );

  return (
    <Router>
      <Routes>

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Login setIsAuthenticated={setIsAuthenticated} />
          }
        />

        <Route
          path="/dashboard"
          element={
            isAuthenticated
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/customer-analysis"
          element={
            isAuthenticated
              ? <CustomerAnalysis />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/prediction"
          element={
            isAuthenticated
              ? <Prediction />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/portfolio-analytics"
          element={
            isAuthenticated
              ? <PortfolioAnalytics />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/reports"
          element={
            isAuthenticated
              ? <Reports />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated ? '/dashboard' : '/login'}
              replace
            />
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={isAuthenticated ? '/dashboard' : '/login'}
              replace
            />
          }
        />

      </Routes>
    </Router>
  );
}

export default App;