// src/components/StatisticiChart.jsx

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import './StatisticiChart.css';

const StatisticiChart = ({ stat }) => {
  if (!stat || Object.keys(stat).length === 0) {
    return null;
  }

  const data = [
    { nume: 'Elevi', valoare: stat.elevi || 0 },
    { nume: 'Profesori', valoare: stat.profesori || 0 },
    { nume: 'Cursuri', valoare: stat.cursuri || 0 },
    { nume: 'Materiale', valoare: stat.materiale || 0 },
  ];

  return (
    <div className="chart-wrapper animated-chart">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 20, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" 
                 tick={{ fontSize: '0.8rem' }} 
                 axisLine={false} 
                 tickLine={false} />
          <YAxis
            dataKey="nume"
            type="category"
            width={100}
            tickLine={false}
            axisLine={false}
            style={{ fontSize: '0.9rem' }}
          />
          <Tooltip formatter={(valoare) => [`${valoare}`, 'Număr']} />

          <Bar
            dataKey="valoare"
            fill="#2f5972"
            barSize={20}
            animationBegin={300}      
            animationDuration={1200}   
            animationEasing="ease-out"
          >
            <LabelList dataKey="valoare" position="right" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatisticiChart;
