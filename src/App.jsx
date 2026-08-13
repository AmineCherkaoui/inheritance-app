import { BrowserRouter, Routes, Route } from 'react-router';

import ResultsPage from './components/ResultsPage';
import CalculatorPageV2 from './components/CalculatorPageV2';
import CalculatorPageV3 from './components/CalculatorPageV3';
import { CalculatorPage } from './components/CalculatorPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/v2" element={<CalculatorPageV2 />} />
        <Route path="/v3" element={<CalculatorPageV3 />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
