import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PortfolioChart = ({ data, title }) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    ...value
  }));

  return (
    <div className="card h-80">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="loan_amount" fill="#003366" name="Total Amount" />
          <Bar dataKey="count" fill="#4A90E2" name="Count" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioChart;
