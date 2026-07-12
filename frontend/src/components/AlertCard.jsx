import React from 'react';
import { AlertTriangle, Clock, User } from 'lucide-react';

const AlertCard = ({ alert }) => {
  const getSeverityColor = (level) => {
    switch (level) {
      case 'HIGH':
        return 'border-red-500 bg-red-50';
      case 'MEDIUM':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-blue-500 bg-blue-50';
    }
  };

  return (
    <div className={`card border-l-4 ${getSeverityColor(alert.risk_level)} mb-3`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-full ${
            alert.risk_level === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
          }`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-semibold">{alert.customer_id}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{alert.reason}</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{alert.alert_date}</span>
              </div>
              <span>Credit Score: {alert.credit_score}</span>
              <span>Missed Payments: {alert.missed_payments}</span>
            </div>
          </div>
        </div>
        <button className="text-banking-secondary hover:text-banking-accent text-sm font-medium">
          View Details
        </button>
      </div>
    </div>
  );
};

export default AlertCard;
