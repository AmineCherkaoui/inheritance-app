import { BrowserRouter, Routes, Route, Navigate } from 'react-router';

import ResultsPage from './components/ResultsPage';
import CalculatorPageV3 from './components/CalculatorPageV3';
import { CalculatorPage } from './components/CalculatorPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/v2" element={<Navigate to="/v3" replace />} />
        <Route path="/v3" element={<CalculatorPageV3 />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
