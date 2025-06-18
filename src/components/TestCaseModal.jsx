import React from 'react';
import './TestCaseModal.css';

const TestCaseModal = ({ isOpen, sheetName, data, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-header">
          <h3>{sheetName} – Test Cases</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="modal-body">
          <table className="test-table">
            <thead>
              <tr>
                <th>ID</th><th>Scenario</th><th>Test Type</th><th>Case Type</th><th>Result</th>
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

export default TestCaseModal;
