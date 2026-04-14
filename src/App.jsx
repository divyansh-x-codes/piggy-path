import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Splash from './screens/Splash';
import Auth from './screens/Auth';
import Home from './screens/Home';
import Stocks from './screens/Stocks';
import StockDetail from './screens/StockDetail';
import Profile from './screens/Profile';
import News from './screens/News';
import Article from './screens/Article';
import Bucket from './screens/Bucket';
import IPO from './screens/IPO';
import Watchlist from './screens/Watchlist';
import Analysis from './screens/Analysis';
import './index.css';

const ScreenRenderer = () => {
  const { currentScreen } = useAppContext();

  return (
    <div className="screen active" style={{ animation: 'none' }}>
      {currentScreen === 'splash' && <Splash />}
      {currentScreen === 'auth' && <Auth />}
      {currentScreen === 'home' && <Home />}
      {currentScreen === 'stocks' && <Stocks />}
      {currentScreen === 'stock-detail' && <StockDetail />}
      {currentScreen === 'profile' && <Profile />}
      {currentScreen === 'news' && <News />}
      {currentScreen === 'article' && <Article />}
      {currentScreen === 'bucket' && <Bucket />}
      {currentScreen === 'ipo' && <IPO />}
      {currentScreen === 'watchlist' && <Watchlist />}
      {currentScreen === 'analysis' && <Analysis />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <div id="root">
        <ScreenRenderer />
      </div>
    </AppProvider>
  );
}

export default App;
