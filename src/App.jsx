import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ChartDetails from './components/ChartDetails';
import { SelectedChartProvider } from './context/SelectedChartContext';

function App() {
  return (
    <Router>
      <SelectedChartProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/details/:sheet" element={<ChartDetails />} />
        </Routes>
      </SelectedChartProvider>
    </Router>
  );
}

export default App;
