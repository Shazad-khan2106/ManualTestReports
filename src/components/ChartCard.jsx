import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import './ChartCard.css';

const COLORS = ['#00C49F', '#FF8042', '#8884d8'];

const ChartCard = ({ sheetName, testData, onChartClick }) => {
  const [chartTitle, setChartTitle] = useState(`${sheetName} : Test Result`);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`chartTitle_${sheetName}`);
    if (saved) setChartTitle(saved);
  }, [sheetName]);

  const handleTitleChange = (e) => {
    setChartTitle(e.target.value);
    localStorage.setItem(`chartTitle_${sheetName}`, e.target.value);
  };

  const passed = testData.filter(d => d.result?.toLowerCase() === 'pass').length;
  const failed = testData.filter(d => d.result?.toLowerCase() === 'fail').length;
  const skipped = testData.filter(d => !d.result || d.result.trim() === '').length;

  const pieData = [
    { name: 'Passed', value: passed },
    { name: 'Failed', value: failed },
    { name: 'Skipped', value: skipped },
  ];

  const groupByType = {};
  testData.forEach(d => {
    const type = d.testType || 'Unknown';
    const result = d.result?.toLowerCase() || 'skipped';
    if (!groupByType[type]) groupByType[type] = { testType: type, pass: 0, fail: 0, skipped: 0 };
    if (result === 'pass') groupByType[type].pass += 1;
    else if (result === 'fail') groupByType[type].fail += 1;
    else groupByType[type].skipped += 1;
  });

  const barData = Object.values(groupByType);

  return (
    <div className="chart-card-container">
      <div className="title-wrapper" onDoubleClick={() => setEditing(true)}>
        {editing ? (
          <input
            value={chartTitle}
            onChange={handleTitleChange}
            onBlur={() => setEditing(false)}
            autoFocus
            className="title-input"
          />
        ) : (
          <>
            <h4 className="dashboard-title">{chartTitle}</h4>
            <span className="edit-icon" onClick={() => setEditing(true)}>✏️</span>
          </>
        )}
      </div>

      <div onClick={() => onChartClick(sheetName, testData)} className="chart-content">
        <BarChart width={500} height={300} data={barData}>
          <XAxis dataKey="testType" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pass" stackId="a" fill="#00C49F" />
          <Bar dataKey="fail" stackId="a" fill="#FF8042" />
          <Bar dataKey="skipped" stackId="a" fill="#8884d8" />
        </BarChart>

        <PieChart width={300} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </div>
  );
};

export default ChartCard;
