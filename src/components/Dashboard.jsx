import React, { useEffect, useState } from 'react';
import { useSheetsData } from '../hooks/useSheetsData';
import { useSelectedChart } from '../context/SelectedChartContext';
import { useNavigate } from 'react-router-dom';
import BarChartCard from './BarChartCard';
import PieChartCard from './PieChartCard';
import TestCaseModal from './TestCaseModal';
import './Dashboard.css';
import logo from '../assets/logo.png';

const Dashboard = () => {
  const { loadAllSheets } = useSheetsData();
  const [sheets, setSheets] = useState([]);
  const navigate = useNavigate();
  const { setSelectedChart } = useSelectedChart();

  const [dashboardTitle, setDashboardTitle] = useState('Integration Test Dashboard : Coupa Agentspace');
  const [editingTitle, setEditingTitle] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedTitle = localStorage.getItem('dashboardTitle');
    if (savedTitle) setDashboardTitle(savedTitle);

    const fetchData = async () => {
      const data = await loadAllSheets();
      setSheets(data);
    };
    fetchData();
  }, []);

  const handleChartClick = (sheetName, data, chartType) => {
    setSelectedChart({ sheet: sheetName, data, chartType });
    navigate(`/details/${encodeURIComponent(sheetName)}`);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setDashboardTitle(newTitle);
    localStorage.setItem('dashboardTitle', newTitle);
  };

  return (
    <div className="dashboard-wrapper">
      {/* Header */}
      <div className="dashboard-header">
        {editingTitle ? (
          <input
            className="dashboard-title-input"
            value={dashboardTitle}
            onChange={handleTitleChange}
            onBlur={() => setEditingTitle(false)}
            autoFocus
          />
        ) : (
          <h2 onDoubleClick={() => setEditingTitle(true)} className="dashboard-header-title">
            {dashboardTitle} <span className="edit-icon">✏️</span>
          </h2>
        )}
        <img src={logo} alt="logo" className="dashboard-logo" />
      </div>

      {/* Chart Cards */}
      <div className="charts-grid">
        {sheets.map((sheet, index) => (
          <React.Fragment key={index}>
            <BarChartCard
              sheetName={sheet.name}
              testData={sheet.data}
              onClick={() => handleChartClick(sheet.name, sheet.data, 'bar')}
            />
            <PieChartCard
              sheetName={sheet.name}
              testData={sheet.data}
              onClick={() => handleChartClick(sheet.name, sheet.data, 'pie')}
            />
          </React.Fragment>
          
        ))}
        {/* <div className="add-chart-card" onClick={() => setIsAddModalOpen(true)}>
        <div className="plus-icon">+</div>
        <p>Add Chart</p>
        </div> */}
      </div>
        
      {/* Test Case Modal (Optional) */}
      <TestCaseModal
        isOpen={isModalOpen}
        sheetName={selectedSheet}
        data={selectedData}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
