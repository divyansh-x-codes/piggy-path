import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { STOCKS, NEWS } from '../data/mockData';
import { BottomNav } from '../components/Shared';
import { Line } from 'react-chartjs-2';

import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Battery, LayoutGrid, GraduationCap, Users, 
  Activity, Brain, Cross, Landmark, Wheat, 
  Pizza, PiggyBank, Briefcase, Zap, TrendingUp 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PriceDisplay = ({ price, isUp }) => {
  const [prevPrice, setPrevPrice] = React.useState(price);
  const [flash, setFlash] = React.useState(false);

  React.useEffect(() => {
    if (price !== prevPrice) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 600);
      setPrevPrice(price);
      return () => clearTimeout(timer);
    }
  }, [price, prevPrice]);

  return (
    <motion.div
      animate={flash ? { 
        scale: [1, 1.1, 1],
        color: isUp ? ['#FFFFFF', '#4ADE80', '#FFFFFF'] : ['#FFFFFF', '#F87171', '#FFFFFF']
      } : {}}
      transition={{ duration: 0.5 }}
      style={{ fontSize: '16px', fontWeight: '900', color: '#FFFFFF', marginBottom: '6px' }}
    >
      ₹{price.toLocaleString('en-IN')}
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const {
    portfolio, getPortfolioValue, userData,
    getPrice, getChange, forceSeed, user, stocks
  } = useAppContext();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [leaderboard, setLeaderboard] = React.useState(null);

  const isSuperAdmin = user?.email === 'simplydivyanshk@gmail.com';

  const [expandedId, setExpandedId] = React.useState(null);
  const [manipulating, setManipulating] = React.useState(null);

  const portfolioValue = getPortfolioValue();

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 0) {
      const filtered = STOCKS.filter(s =>
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.ticker.toLowerCase().includes(q.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

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
    return <div style={{ width: 34, height: 34, borderRadius: 10, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12 }}>{logoType.substring(0, 2).toUpperCase()}</div>;
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
            <div key={id} onClick={() => navigate(`/stock/${id}`)} style={{ minWidth: 160, background: '#6D28D9', borderRadius: 20, border: '1.5px solid black', padding: '14px', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', boxShadow: '0 4px 12px rgba(109, 40, 217, 0.2)' }}>
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

  const goScreen = (scr) => navigate(`/${scr}`);

  // MARKET MASTER: RANK ALL COMPANIES (Strictly 14 companies from MOCK_STOCKS)
  const masterLeaderboard = React.useMemo(() => {
    return STOCKS.map(s => {
      const live = stocks[s.id] || {};
      const price = live.price || s.basePrice || 0;
      const prev = live.prevPrice || price;
      const change = prev !== 0 ? ((price - prev) / prev) * 100 : 0;
      return { 
        ...s, 
        price, 
        change,
        history: live.history || [price, price]
      };
    }).sort((a, b) => b.change - a.change);
  }, [stocks]);

  const getStockIcon = (id, color = "white") => {
    const props = { size: 20, color, strokeWidth: 2.5 };
    switch(id.toLowerCase()) {
      case 'vnst': return <Battery {...props} />;
      case 'xads': return <LayoutGrid {...props} />;
      case 'sklbr': return <GraduationCap {...props} />;
      case 'prspr': return <Users {...props} />;
      case 'nrtk': return <Activity {...props} />;
      case 'nriq': return <Brain {...props} />;
      case 'mdnb': return <Cross {...props} />;
      case 'kspay': return <Landmark {...props} />;
      case 'crpp': return <Wheat {...props} />;
      case 'snac': return <Pizza {...props} />;
      case 'piggy': return <PiggyBank {...props} />;
      case 'proqm': return <Briefcase {...props} />;
      case 'elite': return <Zap {...props} />;
      case 'mookh': return <Brain {...props} />;
      default: return <Zap {...props} />;
    }
  };

  const renderSparkline = (id, historyData) => {
    const history = (historyData || []).slice(-20);
    const isUp = history[history.length - 1] >= history[0];
    const chartColor = isUp ? '#4ADE80' : '#F87171'; // Glowing green / red

    const data = {
      labels: history.map(() => ''),
      datasets: [{
        data: history,
        borderColor: chartColor,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: 0,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 40);
          gradient.addColorStop(0, isUp ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          return gradient;
        },
      }]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: { x: { display: false }, y: { display: false } },
      animation: { duration: 0 }
    };

    return (
      <div style={{ width: 100, height: 40, position: 'relative' }}>
        <Line data={data} options={options} />
      </div>
    );
  };

  if (isSuperAdmin) {
    return (
      <div style={{ 
        flex: 1, display: 'flex', flexDirection: 'column', height: '100%', 
        background: 'linear-gradient(180deg, #101827 0%, #0B0F1A 100%)',
        color: 'white', fontFamily: "'Inter', sans-serif" 
      }}>

        {/* HEADER - INNOVATION LEADERSHIP (Synced to SuperAdmin view) */}
        <div style={{ padding: '36px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.3px', color: '#FFFFFF', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>TERMINAL</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <div className="pulse-emerald" style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%', boxShadow: '0 0 10px #4ADE80' }}></div>
                <span style={{ fontSize: '10px', fontWeight: '900', color: '#4ADE80', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Pure Realtime Sync</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#94A3B8', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>{masterLeaderboard.length} Monitoring</div>
                <div 
                  onClick={async () => {
                    if (window.confirm("RESET CLOUD DATA?")) {
                      await forceSeed();
                    }
                  }}
                  style={{ color: '#7C3AED', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}
                >
                  SYNC DATA ↺
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 100px' }}>
          <motion.div 
            layout
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <AnimatePresence mode="popLayout">
            {masterLeaderboard.map((stock, i) => {
              const chg = stock.change;
              const isUp = chg >= 0;
              const isExpanded = expandedId === stock.id;
              const cardThemeColor = isUp ? '#4ADE80' : '#F87171';

              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={stock.id} 
                  className="innovation-card"
                  style={{
                    background: 'rgba(31, 41, 55, 0.3)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '24px',
                    border: isExpanded ? `1.5px solid ${cardThemeColor}` : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: isExpanded ? `0 0 30px ${cardThemeColor}11` : 'none',
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative'
                  }}
                >
                  {/* Rank Badge */}
                  <motion.div 
                    layout
                    style={{ 
                      position: 'absolute', top: 12, left: 14, 
                      fontSize: '11px', fontWeight: '900', color: cardThemeColor, 
                      background: `${cardThemeColor}11`, padding: '2px 8px', borderRadius: 8,
                      zIndex: 2
                    }}
                  >
                    {i + 1}
                  </motion.div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '24px 18px 18px',
                      cursor: 'pointer',
                      opacity: manipulating === stock.id ? 0.4 : 1,
                      gap: 12
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : stock.id)}
                  >
                    {/* Left: Info (35% width) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 0 35%', minWidth: 0 }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        flexShrink: 0,
                        borderRadius: '16px',
                        background: 'rgba(0, 0, 0, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1.5px solid ${cardThemeColor}33`,
                        boxShadow: `inset 0 0 15px ${cardThemeColor}11`
                      }}>
                        {getStockIcon(stock.id, cardThemeColor)}
                      </div>
                      
                      <div style={{ minWidth: 0 }}>
                        <div style={{ 
                          fontSize: '14px', 
                          fontWeight: '900', 
                          color: '#FFFFFF', 
                          letterSpacing: '-0.2px', 
                          whiteSpace: 'nowrap', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis' 
                        }} title={stock.name}>
                          {stock.name}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700', marginTop: 2, display: 'flex', gap: 4, alignItems: 'center' }}>
                          <span>{stock.ticker}</span>
                          <span style={{ width: 3, height: 3, background: '#4B5563', borderRadius: '50%' }}></span>
                          <span style={{ color: '#64748B' }}>{stock.sector.split('/')[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Graph (30% width) */}
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
                      <div style={{ width: '100%', maxWidth: '100px', display: 'flex', justifyContent: 'center' }}>
                        {renderSparkline(stock.id, stock.history)}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: 6 }}>
                        <TrendingUp size={10} color="#4ADE80" />
                        <span style={{ fontSize: '8px', fontWeight: '900', color: '#94A3B8', letterSpacing: 0.5 }}>UP 2 SPOTS</span>
                      </div>
                    </div>

                    {/* Right: Pricing (30% width) */}
                    <div style={{ textAlign: 'right', flex: '0 0 30%', minWidth: 80 }}>
                      <PriceDisplay price={stock.price} isUp={isUp} />
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        background: isUp ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                        border: `1px solid ${cardThemeColor}22`,
                        color: cardThemeColor,
                        fontSize: '11px',
                        fontWeight: '900',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        {isUp ? '▲' : '▼'} {Math.abs(chg).toFixed(2)}%
                      </div>
                    </div>
                  </div>

                  {/* PROGESS BAR (Gradients) */}
                  <div style={{ height: '4px', width: '100%', background: 'rgba(0,0,0,0.3)', position: 'relative' }}>
                     <div style={{ 
                       height: '100%', 
                       width: `${Math.max(20, 100 - (i * 6))}%`, 
                       background: `linear-gradient(90deg, ${cardThemeColor}22, ${cardThemeColor})`,
                       boxShadow: `0 0 15px ${cardThemeColor}44`,
                       borderRadius: '0 4px 4px 0'
                     }} />
                  </div>
                </motion.div>
              );
            })}
            </AnimatePresence>
          </motion.div>
          <div style={{ padding: '60px 0', textAlign: 'center', opacity: 0.2 }}>
            <p style={{ fontSize: 11, fontWeight: 800, color: '#111', textTransform: 'uppercase', letterSpacing: '4px' }}>Market closed</p>
          </div>
        </div>
        <BottomNav active="home" />
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA' }}>

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 20px', position: 'relative', zIndex: 100, marginTop: 20 }}>
        <div onClick={() => navigate('/home')} style={{ width: 42, height: 42, borderRadius: '50%', border: '1.5px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>

        {/* SEARCH BAR CONTAINER */}
        <div style={{ flex: 1, margin: '0 12px', position: 'relative' }}>
          <div style={{ border: '1.5px solid black', borderRadius: 50, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8, background: 'white' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={handleSearch}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: 'black' }}
            />
            {searchQuery && (
              <span onClick={() => { setSearchQuery(''); setResults([]); }} style={{ cursor: 'pointer', fontSize: 16, fontWeight: 800 }}>✕</span>
            )}
          </div>

          {/* SEARCH RESULTS DROPDOWN */}
          {results.length > 0 && (
            <div style={{ position: 'absolute', top: 52, left: 0, right: 0, background: 'white', borderRadius: 20, border: '1.5px solid black', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', overflow: 'hidden', zIndex: 1000 }}>
              {results.slice(0, 5).map(s => (
                <div
                  key={s.id}
                  onClick={() => { navigate(`/stock/${s.id}`); setSearchQuery(''); setResults([]); }}
                  style={{ padding: '12px 16px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: (s.color || '#eee') + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: s.color }}>
                      {s.logo || s.name[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>{s.ticker}</div>
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              ))}
            </div>
          )}
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

          <div style={{ display: 'flex', gap: 15, marginBottom: 25, background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 9, opacity: 0.6, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginBottom: 4 }}>Account</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.8 }}>₹</span>
                <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'sans-serif', letterSpacing: '-0.5px' }}>
                  {(userData?.balance || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.1)' }}></div>
            <div style={{ flex: 1, paddingLeft: 10 }}>
              <p style={{ fontSize: 9, opacity: 0.6, textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', marginBottom: 4 }}>Portfolio</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 700, opacity: 0.8 }}>₹</span>
                <span style={{ fontSize: 24, fontWeight: 900, fontFamily: 'sans-serif', letterSpacing: '-0.5px' }}>
                  {Number(portfolioValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => navigate('/profile')} style={{ flex: 1, background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '12px 20px', borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>View Portfolio</button>
          </div>
        </div>

        {/* Shortcuts */}
        <div style={{ display: 'flex', justifyContent: 'space-around', padding: '0 16px 20px' }}>
          {[
            { id: 'stocks', icon: '📈', label: 'Stocks' },
            { id: 'ipo', icon: '🏦', label: 'IPO' },
            { id: 'watchlist', icon: '👁️', label: 'Watchlist' },
            { id: 'bucket', icon: '🪣', label: 'Bucket' }
          ].map(item => (
            <div key={item.id} onClick={() => navigate(`/${item.id}`)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
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
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer' }} onClick={() => navigate('/stocks')}>View all</span>
        </div>
        {renderPortfolioCards()}

        {/* News Section — using static NEWS data from mockData */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'black', fontFamily: '"Syne", sans-serif' }}>News</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer' }} onClick={() => goScreen('news')}>View all</span>
        </div>
        <div style={{ padding: '0 20px' }}>
          {NEWS.slice(0, 2).map(n => (
            <div key={n.id} className="card" style={{ marginBottom: 10, cursor: 'pointer' }} onClick={() => navigate('/news')}>
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

        {/* Featured Listings Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', marginTop: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: 'black', fontFamily: '"Syne", sans-serif' }}>Featured Listings</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7C3AED', cursor: 'pointer' }} onClick={() => navigate('/stocks')}>View all</span>
        </div>
        <div className="scroll-row" style={{ padding: '0 20px 20px 20px', gap: 12 }}>
          {STOCKS.map(s => {
            const p = getPrice(s);
            const chg = getChange(s);
            const isUp = chg >= 0;
            return (
              <div key={s.id} onClick={() => navigate(`/stock/${s.id}`)} className="stock-card" style={{ minWidth: 160, cursor: 'pointer' }}>
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
      </div>

      <BottomNav active="home" />
    </div>
  );
};

export default Home;
