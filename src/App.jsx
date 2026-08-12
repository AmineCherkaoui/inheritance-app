
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router';

import ResultsPage from './components/ResultsPage';
import CalculatorPageV2 from './components/CalculatorPageV2';

import { CalculatorPage } from './components/CalculatorPage';




export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/v2" element={<CalculatorPageV2 />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
