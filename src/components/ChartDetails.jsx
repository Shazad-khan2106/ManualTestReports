import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import './Dashboard.css';
import './ChartDetails.css';
import logo from '../assets/logo.png';
import { useSheetsData } from '../hooks/useSheetsData';
import { useSelectedChart } from '../context/SelectedChartContext';

const COLORS = ['#00C49F', '#FF8042', '#8884d8'];

const ChartDetails = () => {
  const { sheet } = useParams();
  const navigate = useNavigate();
  const { loadAllSheets } = useSheetsData();
  const { selectedChart } = useSelectedChart();

  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [sheetName, setSheetName] = useState(sheet);

  useEffect(() => {
    const fetchSheetData = async () => {
      if (selectedChart?.data && selectedChart?.sheet) {
        setData(selectedChart.data);
        setChartType(selectedChart.chartType || 'bar');
        setSheetName(selectedChart.sheet);
      } else {
        const allSheets = await loadAllSheets();
        const matched = allSheets.find(s => s.name === sheet);
        setData(matched?.data || []);
        setChartType('bar'); // fallback
        setSheetName(sheet);
      }
    };

    fetchSheetData();
  }, [sheet, selectedChart]);

  const passed = data.filter(d => d.result?.toLowerCase() === 'pass').length;
  const failed = data.filter(d => d.result?.toLowerCase() === 'fail').length;
  const skipped = data.filter(d => !d.result || d.result.trim() === '').length;

  const pieData = [
    { name: 'Passed', value: passed },
    { name: 'Failed', value: failed },
    { name: 'Skipped', value: skipped }
  ];

  const groupByType = {};
  data.forEach(d => {
    const type = d.testType || 'Unknown';
    const result = d.result?.toLowerCase() || 'skipped';
    if (!groupByType[type]) {
      groupByType[type] = { testType: type, pass: 0, fail: 0, skipped: 0 };
    }
    if (result === 'pass') groupByType[type].pass += 1;
    else if (result === 'fail') groupByType[type].fail += 1;
    else groupByType[type].skipped += 1;
  });

  const barData = Object.values(groupByType);

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header">
        <h2>{sheetName} – Test Details</h2>
        <img src={logo} alt="logo" className="dashboard-logo" />
      </div>

      {/* Chart & Summary */}
      <div className="chart-detail-section">
        <div className="chart-summary-container">
          {/* Chart Box */}
          <div className="chart-box">
            <button className="back-button" onClick={() => navigate(-1)}>
              ← Back to Dashboard
            </button>
            <h4>{sheetName} : {chartType === 'bar' ? 'Test Result' : 'Test Coverage'}</h4>
            <ResponsiveContainer width="100%" height={320}>
              {chartType === 'bar' ? (
                <BarChart data={barData}>
                  <XAxis dataKey="testType" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pass" stackId="a" fill="#00C49F" />
                  <Bar dataKey="fail" stackId="a" fill="#FF8042" />
                  <Bar dataKey="skipped" stackId="a" fill="#8884d8" />
                </BarChart>
              ) : (
                <PieChart>
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
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Summary Box */}
          <div className="summary-box">
            <h4>Test Summary</h4>
            <div className="summary-item"><strong>Last Executed:</strong><span> June 18, 2025</span></div><hr />
            <div className="summary-item"><strong>Executed By:</strong><span> Shazad Khan</span></div><hr />
            <div className="summary-item"><strong>Smoke:</strong><span> 5</span></div><hr />
            <div className="summary-item"><strong>Regression:</strong><span> 10</span></div><hr />
            <div className="summary-item"><strong>Positive:</strong><span> 20</span></div><hr />
            <div className="summary-item"><strong>Negative:</strong><span> 10</span></div><hr />
            <div className="summary-item"><strong>Edge:</strong><span> 5</span></div><hr />
            <div className="summary-item"><strong>Passed:</strong><span> {passed}</span></div><hr />
            <div className="summary-item"><strong>Failed:</strong><span> {failed}</span></div><hr />
            <div className="summary-item"><strong>Skipped:</strong><span> {skipped}</span></div>
          </div>
        </div>

        <hr className="chart-table-divider" />

        {/* Test Case Table */}
        <div className="test-case-table-section">
          <h3>Test Case Details</h3>
          <table className="test-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Scenario</th>
                <th>Test Type</th>
                <th>Case Type</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i}>
                  <td>{d.id}</td>
                  <td>{d.scenario}</td>
                  <td>{d.testType}</td>
                  <td>{d.caseType}</td>
                  <td>{d.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChartDetails;
