import { createContext, useContext, useState } from 'react';

const SelectedChartContext = createContext();

export const useSelectedChart = () => useContext(SelectedChartContext);

export const SelectedChartProvider = ({ children }) => {
  const [selectedChart, setSelectedChart] = useState({
    sheet: null,
    data: [],
    chartType: 'bar'
  });

  return (
    <SelectedChartContext.Provider value={{ selectedChart, setSelectedChart }}>
      {children}
    </SelectedChartContext.Provider>
  );
};
