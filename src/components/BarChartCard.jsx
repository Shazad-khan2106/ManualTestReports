import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
import './ChartCard.css';

const BarChartCard = ({ sheetName, testData, onClick }) => {
  const type = 'bar';
  const storageKey = `chartTitle_${sheetName}_${type}`;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(`${sheetName} : Test Result`);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setTitle(saved);
  }, [sheetName]);

  const handleChange = (e) => {
    setTitle(e.target.value);
    localStorage.setItem(storageKey, e.target.value);
  };

  const groupByType = {};
  testData.forEach(d => {
    const type = d.testType || 'Unknown';
    const result = d.result?.toLowerCase() || 'skipped';
    if (!groupByType[type]) groupByType[type] = { testType: type, pass: 0, fail: 0, skipped: 0 };
    if (result === 'pass') groupByType[type].pass += 1;
    else if (result === 'fail') groupByType[type].fail += 1;
    else groupByType[type].skipped += 1;
  });

  const data = Object.values(groupByType);

  return (
    <div
  className="chart-card-container"
  onClick={() => onClick(sheetName, testData, 'bar')}
>
      <div className="title-wrapper" onDoubleClick={() => setEditing(true)}>
        {editing ? (
          <input
            className="title-input"
            value={title}
            onChange={handleChange}
            onBlur={() => setEditing(false)}
            autoFocus
          />
        ) : (
          <>
            <p className="dashboard-title">{title}</p>
            <span className="edit-icon" onClick={() => setEditing(true)}>✏️</span>
          </>
        )}
      </div>

      <BarChart width={260} height={200} data={data}>
        <XAxis dataKey="testType" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="pass" stackId="a" fill="#00C49F" />
        <Bar dataKey="fail" stackId="a" fill="#FF8042" />
        <Bar dataKey="skipped" stackId="a" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default BarChartCard;
