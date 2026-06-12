import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const CATEGORY_COLORS = {
  Food: '#6366f1',
  Transport: '#a855f7',
  Entertainment: '#ec4899',
  Utilities: '#06b6d4',
  Shopping: '#f59e0b',
  Other: '#10b981'
};

export default function ExpenseChart({ expenses }) {
  const [chartType, setChartType] = useState('pie'); // 'pie' or 'bar'

  // Prepare data by grouping expenses by category
  const dataMap = expenses.reduce((acc, curr) => {
    const amt = Number(curr.amount) || 0;
    acc[curr.category] = (acc[curr.category] || 0) + amt;
    return acc;
  }, {});

  const chartData = Object.entries(dataMap).map(([name, value]) => ({
    name,
    value,
    color: CATEGORY_COLORS[name] || '#64748b'
  })).sort((a, b) => b.value - a.value);

  if (expenses.length === 0) {
    return (
      <div className="card chart-card" style={{ minHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No data available for visualization.</p>
      </div>
    );
  }

  // Custom tooltip to match our dark glassmorphic UI
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
            }).format(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <h2>Visual Breakdown</h2>
        <div className="chart-toggle-tabs">
          <button
            type="button"
            className={`tab-btn ${chartType === 'pie' ? 'active' : ''}`}
            onClick={() => setChartType('pie')}
          >
            Pie
          </button>
          <button
            type="button"
            className={`tab-btn ${chartType === 'bar' ? 'active' : ''}`}
            onClick={() => setChartType('bar')}
          >
            Bar
          </button>
        </div>
      </div>

      <div className="chart-body" style={{ width: '100%', height: '280px', marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <XAxis
                dataKey="name"
                stroke="var(--text-muted)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="var(--text-muted)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0,
                  }).format(value)
                }
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} isAnimationActive={false} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
