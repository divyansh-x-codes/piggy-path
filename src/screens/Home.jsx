import React from 'react';
import { useAppContext } from '../context/AppContext';
import { STOCKS, NEWS } from '../data/mockData';
import { BottomNav } from '../components/Shared';

const Home = () => {
  const {
    goScreen, portfolio, getPortfolioValue, userData,
    setCurrentStock, getPrice, getChange, openStockDetail, forceSeed
  } = useAppContext();
  const portfolioValue = getPortfolioValue();

  const renderLogo = (logoType) => {
    if (logoType === 'ms') {
      return (
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'white', display: 'flex', flexWrap: 'wrap', padding: 3, border: '1px solid var(--border)' }}>
          <div style={{ width: '50%', height: '50%', background: '#F25022', borderRadius: '4px 0 0 0', border: '1px solid white' }}></div>
          <div style={{ width: '50%', height: '50%', background: '#7FBA00', borderRadius: '0 4px 0 0', border: '1px solid white' }}></div>
          <div style={{ width: '50%', height: '50%', background: '#00A4EF', border: '1px solid white' }}></div>
          <div style={{ width: '50%', height: '50%', background: '#FFB900', border: '1px solid white' }}></div>
        </div>
      );
    }
    if (logoType === 'apple') {
      return (
        <div style={{ width: 34, height: 34, borderRadius: 10, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
          <svg width="20" height="20" viewBox="0 0 384 512"><path fill="#111" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.1-44.6-35.9-2.8-74.3 22.7-95.1 22.7-20.3 0-51-22.3-81.8-22.3-43.2 0-85.3 25.8-108.3 67.5-47.2 85.3-12.7 212.1 33.7 279 23.1 33.5 50 69.8 85.6 68.6 34.6-1.2 46.8-22.5 89.2-22.5 42.1 0 53.6 22.5 89.6 22.1 36.7-.4 60.1-33.8 82.8-67.1 26.6-39.6 37.6-78.2 38.3-80.2-1.1-.5-75.1-28.5-74.9-106zM254.6 96.5c19.1-23.7 32.1-56.7 28.5-89.5-28.2 1.2-62.8 19-82.6 42.7-16.7 20-31.5 54.1-26.9 86.4 31.8 2.5 63.8-16.3 81-39.6z" /></svg>
        </div>
      );
    }
    return <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>{logoType.substring(0,2).toUpperCase()}</div>;
  };

  const renderPortfolioCards = () => {
    const holdings = portfolio.holdings || {};
    const holdingIds = Object.keys(holdings).filter(id => holdings[id]?.qty > 0);
    
    if (holdingIds.length === 0) {
      return (
        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ padding: 20, background: 'white', borderRadius: 20, border: '1.5px dashed #ccc', textAlign: 'center', color: '#666', fontSize: 13, fontWeight: 500 }}>
            No assets owned. Start trading to see your portfolio here!
          </div>
        </div>
      );
    }

    return (
      <div className="scroll-row" style={{ padding: '0 20px 20px 20px', gap: 16 }}>
        {holdingIds.map(id => {
          const stock = STOCKS.find(s => s.id === id);
          if (!stock) return null;
          const price = getPrice(stock);
          const h = holdings[id];
          const qty = h.qty || 0;
          const avgP = h.avgPrice || 0;
          const value = price * qty;
          const pnl = (price - avgP) * qty;

          return (
            <div key={id} onClick={() => openStockDetail(id)} style={{ minWidth: 160, background: '#6D28D9', borderRadius: 20, border: '1.5px solid black', padding: '14px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', boxShadow: '0 4px 12px rgba(109, 40, 217, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {renderLogo(stock.logo || stock.id)}
                <div style={{ color: 'white', paddingTop: 2 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.1 }}>{stock.name}</div>
                  <div style={{ fontSize: 9, opacity: .9, marginTop: 2 }}>{qty} Shares</div>
                </div>
              </div>
              <div style={{ color: 'white', marginTop: 14 }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.5px', opacity: 0.8 }}>CURRENT VALUE</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 }}>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>₹ {value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  <div style={{ fontSize: 10, color: pnl >= 0 ? '#4ade80' : '#f87171', fontWeight: 800 }}>{pnl >= 0 ? '▲' : '▼'}₹{Math.abs(pnl).toFixed(0)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA' }}>

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', position: 'relative', zIndex: 10, marginTop: 20 }}>
        <div style={{ width: 42, height: 42, borderRadius: '50%', border: '1.5px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>

        <div style={{ flex: 1, margin: '0 12px', border: '1.5px solid black', borderRadius: 50, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8, background: 'white' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Search stocks, IPO...</span>
        </div>

        <div onClick={async () => { 
          try {
            await forceSeed();
            alert('🟢 Cloud Market Data Synchronized!');
          } catch (e) {
            alert('🔴 Sync Failed: Check Firestore rules.');
          }
        }} style={{ width: 42, height: 42, borderRadius: '50%', border: '1.5px solid black', background: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>

        {/* HERO CARD */}
        <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)', margin: 16, borderRadius: 24, padding: 24, color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', top: 30, right: 20, width: 60, height: 60, background: 'var(--green)', borderRadius: '50%', opacity: .6 }}></div>
          <p style={{ fontSize: 13, opacity: 0.8, fontWeight: 600 }}>Hello {userData.name || 'Investor'} 👋</p>
          <p style={{ fontSize: 11, opacity: 0.7, marginBottom: 20 }}>Welcome Back, Let's continue</p>

          <div style={{ display: 'flex', gap: 32, marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.8px', marginBottom: 6 }}>Local Account</p>
              <h2 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 26, margin: 0 }}>
                ₹ {(userData?.balance || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h2>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.2)' }}></div>
            <div>
              <p style={{ fontSize: 10, opacity: 0.7, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.8px', marginBottom: 6 }}>Portfolio Value</p>
              <h2 style={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 26, margin: 0 }}>
                ₹ {Number(portfolioValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>+ Add Money</button>
            <button style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '10px 20px', borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View Analytics</button>
          </div>
        </div>

        {/* Shortcuts */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 16px 20px' }}>
          {[
            { id: 'stocks',    icon: '📈', label: 'Stocks'    },
            { id: 'ipo',       icon: '🏦', label: 'IPO'       },
            { id: 'watchlist', icon: '👁️', label: 'Watchlist' },
            { id: 'bucket',    icon: '🪣', label: 'Bucket'    }
          ].map(item => (
            <div key={item.id} onClick={() => goScreen(item.id)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <div style={{ width: 56, height: 56, border: '1.5px solid var(--border)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, background: 'white' }}>
                {item.icon}
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: 'black' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* My Portfolio */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'black', fontFamily: '"Syne", sans-serif' }}>My Portfolio</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer' }} onClick={() => goScreen('stocks')}>View all</span>
        </div>
        {renderPortfolioCards()}

        {/* News Section — using static NEWS data from mockData */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'black', fontFamily: '"Syne", sans-serif' }}>News</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer' }} onClick={() => goScreen('news')}>View all</span>
        </div>
        <div style={{ padding: '0 20px' }}>
          {NEWS.slice(0, 2).map(n => (
            <div key={n.id} className="card" style={{ marginBottom: 10, cursor: 'pointer' }} onClick={() => goScreen('news')}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 36, height: 36, background: 'var(--purple-light)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: 'var(--purple)' }}>{n.stock[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{n.stock}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{n.ticker}</div>
                  </div>
                </div>
                <span className={`tag ${n.change.startsWith('+') ? 'tag-green' : n.change.startsWith('-') ? 'tag-red' : 'tag-green'}`}>{n.change}</span>
              </div>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{n.title}</p>
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{n.body.substring(0, 80)}...</p>
            </div>
          ))}
        </div>

        {/* Trending Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', marginTop: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'black', fontFamily: '"Syne", sans-serif' }}>Trending</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer' }} onClick={() => goScreen('stocks')}>View all</span>
        </div>
        <div className="scroll-row" style={{ padding: '0 20px 20px 20px', gap: 12 }}>
          {STOCKS.map(s => {
            const p = getPrice(s);
            const chg = getChange(s);
            const isUp = chg >= 0;
            return (
              <div key={s.id} onClick={() => openStockDetail(s.id)} className="stock-card" style={{ minWidth: 160, cursor: 'pointer' }}>
                <div className="stock-logo" style={{ color: s.color }}>{s.logo}</div>
                <div style={{ color: 'white' }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, opacity: .7 }}>{s.ticker}</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>₹ {p.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: isUp ? '#86efac' : '#fca5a5' }}>{isUp ? '▲ +' : '▼ '}{Math.abs(chg).toFixed(2)}%</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* IT Sector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'black', fontFamily: '"Syne", sans-serif' }}>IT Sector</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer' }}>View all</span>
        </div>
        <div className="scroll-row" style={{ padding: '0 20px 20px 20px', gap: 12 }}>
          {STOCKS.filter(s => s.sector === 'IT').map(s => {
            const p = getPrice(s);
            return (
              <div key={s.id} onClick={() => openStockDetail(s.id)} className="stock-card" style={{ minWidth: 160, cursor: 'pointer' }}>
                <div className="stock-logo" style={{ color: s.color }}>{s.logo}</div>
                <div style={{ color: 'white' }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{s.name}</div>
                  <div style={{ fontSize: 11, opacity: .7 }}>{s.ticker}</div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>₹ {p.toLocaleString()}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
};

export default Home;
