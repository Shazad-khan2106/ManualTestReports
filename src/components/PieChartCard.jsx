import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip
} from 'recharts';
import './ChartCard.css';

const COLORS = ['#00C49F', '#FF8042', '#8884d8'];

const PieChartCard = ({ sheetName, testData, onClick }) => {
  const type = 'pie';
  const storageKey = `chartTitle_${sheetName}_${type}`;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(`${sheetName} : Test Coverage`);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setTitle(saved);
  }, [sheetName]);

  const handleChange = (e) => {
    setTitle(e.target.value);
    localStorage.setItem(storageKey, e.target.value);
  };

  const passed = testData.filter(d => d.result?.toLowerCase() === 'pass').length;
  const failed = testData.filter(d => d.result?.toLowerCase() === 'fail').length;
  const skipped = testData.filter(d => !d.result || d.result.trim() === '').length;

  const data = [
    { name: 'Passed', value: passed },
    { name: 'Failed', value: failed },
    { name: 'Skipped', value: skipped }
  ];

  return (
    <div
  className="chart-card-container"
  onClick={() => onClick(sheetName, testData, 'pie')}
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

      <PieChart width={260} height={200}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default PieChartCard;
