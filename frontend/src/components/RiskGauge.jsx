import React from 'react';

const RiskGauge = ({ riskScore, riskLevel }) => {
  const getColor = () => {
    if (riskLevel === 'HIGH') return '#DC3545';
    if (riskLevel === 'MEDIUM') return '#FFC107';
    return '#28A745';
  };

  const getRotation = () => {
    // Convert 0-100 score to rotation angle (-90 to 90 degrees)
    return (riskScore / 100) * 180 - 90;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Background arc */}
        <div className="absolute w-48 h-48 rounded-full border-8 border-gray-200 top-0 left-0"></div>
        
        {/* Colored arc */}
        <div 
          className="absolute w-48 h-48 rounded-full border-8 top-0 left-0"
          style={{
            borderColor: getColor(),
            transform: `rotate(${getRotation()}deg)`,
            borderTopColor: 'transparent',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
          }}
        ></div>
        
        {/* Center point */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-800 rounded-full"></div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-4xl font-bold" style={{ color: getColor() }}>{riskScore}</p>
        <p className="text-sm text-gray-600 mt-1">Risk Score</p>
        <p className="text-lg font-semibold mt-2" style={{ color: getColor() }}>{riskLevel} RISK</p>
      </div>
    </div>
  );
};

export default RiskGauge;
