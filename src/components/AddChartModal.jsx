import React, { useState } from 'react';
import './AddChartModal.css';
import { sheetsConfig, addSheetToConfig } from '../config/sheets'; // You need to build this logic

const AddChartModal = ({ isOpen, onClose, onAddChart }) => {
  const [sheetOption, setSheetOption] = useState('existing');
  const [selectedSheet, setSelectedSheet] = useState('');
  const [newSheetName, setNewSheetName] = useState('');
  const [newSheetLink, setNewSheetLink] = useState('');
  const [chartType, setChartType] = useState('bar');

  const handleAdd = () => {
    if (sheetOption === 'new') {
      addSheetToConfig(newSheetName, newSheetLink);
      onAddChart(newSheetName, chartType);
    } else {
      onAddChart(selectedSheet, chartType);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Chart</h3>

        <label>
          <input
            type="radio"
            value="existing"
            checked={sheetOption === 'existing'}
            onChange={() => setSheetOption('existing')}
          />
          Use Existing Sheet
        </label>
        {sheetOption === 'existing' && (
          <select value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)}>
            <option value="">-- Select Sheet --</option>
            {sheetsConfig.map((sheet, i) => (
              <option key={i} value={sheet.name}>{sheet.name}</option>
            ))}
          </select>
        )}

        <label>
          <input
            type="radio"
            value="new"
            checked={sheetOption === 'new'}
            onChange={() => setSheetOption('new')}
          />
          Add New Sheet
        </label>
        {sheetOption === 'new' && (
          <>
            <input
              placeholder="Sheet Name"
              value={newSheetName}
              onChange={(e) => setNewSheetName(e.target.value)}
            />
            <input
              placeholder="Sheet Link"
              value={newSheetLink}
              onChange={(e) => setNewSheetLink(e.target.value)}
            />
          </>
        )}

        <label>Chart Type</label>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
          <option value="bar">Bar Chart</option>
          <option value="pie">Pie Chart</option>
          {/* Add more types as needed */}
        </select>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleAdd}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddChartModal;
