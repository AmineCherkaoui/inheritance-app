import { BrowserRouter, Routes, Route } from 'react-router';
import { ROUTES } from './constants/links';

import HomePage from './pages/HomePage';
import CalculatorPageV3 from './pages/CalculatorPageV3';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.CALCULATION} element={<CalculatorPageV3 />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
