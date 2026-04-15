import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Splash from './screens/Splash';
import Auth from './screens/Auth';
import Home from './screens/Home';
import Stocks from './screens/Stocks';
import StockDetail from './screens/StockDetail';
import Profile from './screens/Profile';
import News from './screens/News';
import Bucket from './screens/Bucket';
import IPO from './screens/IPO';
import Watchlist from './screens/Watchlist';
import Analysis from './screens/Analysis';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const RootContent = () => {
  const { user, currentScreen } = useAppContext();

  return (
    <div className="screen active" style={{ animation: 'none' }}>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/stock/:stockId" element={<StockDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/news" element={<News />} />
        <Route path="/bucket" element={<Bucket />} />
        <Route path="/ipo" element={<IPO />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/analysis/:stockId" element={<Analysis />} />
        {/* Redirect unknown routes to home or splash */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <RootContent />
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
