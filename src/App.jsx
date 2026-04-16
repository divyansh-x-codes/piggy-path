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
import AdminPanel from './screens/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const RootContent = () => {
  const { user, loading } = useAppContext();

  return (
    <div className="screen active" style={{ animation: 'none' }}>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Splash />} />
        <Route path="/auth" element={<Auth />} />

        {/* AUTHENTICATED ROUTES */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/stocks" element={<ProtectedRoute><Stocks /></ProtectedRoute>} />
        <Route path="/stock/:stockId" element={<ProtectedRoute><StockDetail /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/news" element={<ProtectedRoute><News /></ProtectedRoute>} />
        <Route path="/bucket" element={<ProtectedRoute><Bucket /></ProtectedRoute>} />
        <Route path="/ipo" element={<ProtectedRoute><IPO /></ProtectedRoute>} />
        <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
        <Route path="/analysis/:stockId" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />

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
