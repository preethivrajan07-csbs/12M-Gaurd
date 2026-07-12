import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const RecommendationCard = ({ recommendation }) => {
  const getRecommendationType = (text) => {
    if (text.includes('IMMEDIATE')) return 'danger';
    if (text.includes('MONITOR')) return 'warning';
    return 'info';
  };

  const type = getRecommendationType(recommendation);

  const getStyles = () => {
    switch (type) {
      case 'danger':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'text-red-600',
          iconBg: 'bg-red-100'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'text-yellow-600',
          iconBg: 'bg-yellow-100'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100'
        };
    }
  };

  const styles = getStyles();
  const Icon = type === 'danger' ? AlertCircle : type === 'warning' ? AlertCircle : Info;

  return (
    <div className={`card border-2 ${styles.bg} ${styles.border}`}>
      <div className="flex items-start space-x-3">
        <div className={`p-3 rounded-full ${styles.iconBg} ${styles.icon}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-2">Recommended Action</h3>
          <p className="text-gray-700">{recommendation}</p>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
