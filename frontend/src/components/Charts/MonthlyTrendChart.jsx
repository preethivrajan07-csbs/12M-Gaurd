import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyTrendChart = ({ data }) => {
  const chartData = data.months.map((month, index) => ({
    month: month,
    defaults: data.defaults[index],
    newLoans: data.new_loans[index]
  }));

  return (
    <div className="card h-80">
      <h3 className="text-lg font-semibold mb-4">Monthly Default Trends</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="defaults" stroke="#DC3545" name="Defaults" strokeWidth={2} />
          <Line type="monotone" dataKey="newLoans" stroke="#4A90E2" name="New Loans" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendChart;
