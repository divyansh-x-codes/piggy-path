import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BottomNav } from '../components/Shared';
import { Line } from 'react-chartjs-2';
import { STOCKS } from '../data/mockData';
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

const AdminPanel = () => {
  const navigate = useNavigate();
  const { 
    stocks, isAdmin, resetData, manipulatePrice, isMarketOpen, marketStatus, toggleMarket,
    user, articles, publishArticle, deleteArticle, clearAllArticles, resetGlobalEconomy, forceSeed
  } = useAppContext();
  const [expandedId, setExpandedId] = useState(null);
  const [manipulating, setManipulating] = useState(null);
  const [userLeaderboard, setUserLeaderboard] = useState({ data: [], updatedAt: null });
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [newsForm, setNewsForm] = useState({ title: '', body: '', cat: 'Trending', stock: '' });
  const [isPublishing, setIsPublishing] = useState(false);

  // Listen for User Leaderboard
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "leaderboard", "users_global"), (snap) => {
      if (snap.exists()) {
        setUserLeaderboard(snap.data());
      }
    });
    return () => unsub();
  }, []);

  // 1. MASTER MONITOR LOGIC: CALCULATE TARGET RANKING (Strictly 14 companies)
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

  return (
    <div style={{ 
      flex: 1, display: 'flex', flexDirection: 'column', height: '100%', 
      background: 'linear-gradient(180deg, #101827 0%, #0B0F1A 100%)',
      color: 'white', fontFamily: "'Inter', sans-serif" 
    }}>

      {/* HEADER - INNOVATION LEADERSHIP */}
      <div style={{ padding: '36px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.3px', color: '#FFFFFF', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}>TERMINAL</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
              <div className="pulse-emerald" style={{ width: '8px', height: '8px', background: '#4ADE80', borderRadius: '50%', boxShadow: '0 0 10px #4ADE80' }}></div>
              <span style={{ fontSize: '10px', fontWeight: '900', color: '#4ADE80', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Master Control Active</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: 24 }}>
              <div style={{ color: '#94A3B8', fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 }}>{userLeaderboard.data?.length || 0} Traders</div>
              <div 
                onClick={async () => {
                  if (window.confirm("SYNC MARKET DATA?")) {
                    await forceSeed();
                    alert("🟢 Data Synced");
                  }
                }}
                style={{ color: '#7C3AED', fontSize: '11px', fontWeight: '900', cursor: 'pointer', marginTop: 4 }}
              >
                SYNC DATA ↺
              </div>
              <div 
                onClick={async () => {
                  if (window.confirm("DELETE ALL NEWS ARTICLES?")) {
                    await clearAllArticles();
                    alert("🗑️ Articles Cleared");
                  }
                }}
                style={{ color: '#EF4444', fontSize: '11px', fontWeight: '900', cursor: 'pointer', marginTop: 8 }}
              >
                CLEAR NEWS ×
              </div>
              <div 
                onClick={async () => {
                  if (window.confirm("RESET THE ENTIRE GLOBAL ECONOMY? IRREVERSIBLE.")) {
                    if (window.confirm("ARE YOU ABSOLUTELY SURE?")) {
                       await resetGlobalEconomy();
                       alert("☢️ ECONOMY PURGED");
                    }
                  }
                }}
                style={{ color: '#F97316', fontSize: '11px', fontWeight: '900', cursor: 'pointer', marginTop: 8 }}
              >
                PURGE ECONOMY ⚠
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ padding: '0 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div style={{ 
            background: isMarketOpen ? 'rgba(74, 222, 128, 0.05)' : 'rgba(239, 68, 68, 0.05)',
            borderRadius: '20px',
            padding: '20px',
            border: isMarketOpen ? '1px solid rgba(74, 222, 128, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: isMarketOpen ? '#4ADE80' : '#F87171', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                Market Master Control
              </div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: 'white' }}>
                Currently: {isMarketOpen ? '🟢 LIVE' : '⚪ CLOSED'}
              </div>
            </div>
            
            <button
              onClick={async () => {
                const action = isMarketOpen ? 'CLOSE' : 'OPEN';
                if (window.confirm(`Are you sure you want to ${action} the market?`)) {
                  await toggleMarket(!isMarketOpen);
                }
              }}
              style={{
                padding: '12px 24px',
                borderRadius: '14px',
                background: isMarketOpen ? '#EF4444' : '#22C55E',
                color: 'white',
                border: 'none',
                fontWeight: '900',
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: isMarketOpen ? '0 0 20px rgba(239, 68, 68, 0.3)' : '0 0 20px rgba(34, 197, 94, 0.3)'
              }}
            >
              {isMarketOpen ? 'CLOSE MARKET' : 'OPEN MARKET'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

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

                {/* MANIPULATION TRAY */}
                {isExpanded && (
                  <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(75, 85, 99, 0.2)', display: 'flex', gap: 10 }}>
                    <button 
                      onClick={async (e) => {
                        e.stopPropagation();
                        setManipulating(stock.id);
                        await manipulatePrice(stock.id, 10);
                        setManipulating(null);
                      }}
                      className="glow-button-green"
                      style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#DCFCE7', color: '#15803D', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
                    >
                      🚀 BOOST PRICE +10%
                    </button>
                    <button 
                      onClick={async (e) => {
                        e.stopPropagation();
                        setManipulating(stock.id);
                        await manipulatePrice(stock.id, -10);
                        setManipulating(null);
                      }}
                      className="glow-button-red"
                      style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: '#FEE2E2', color: '#B91C1C', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
                    >
                      📉 CRASH PRICE -10%
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/stock/${stock.id}`); }}
                      style={{ padding: '12px 20px', borderRadius: 12, border: '1px solid #4B5563', background: 'transparent', color: '#94A3B8', fontWeight: 900, fontSize: 11, cursor: 'pointer' }}
                    >
                      REPORT
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
          </AnimatePresence>
        </motion.div>

        {/* NEWS MODAL TRIGGER */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsNewsModalOpen(true)}
          style={{
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
            borderRadius: 24, padding: '24px', margin: '20px 0',
            border: '1.5px solid rgba(99, 102, 241, 0.3)',
            cursor: 'pointer', textAlign: 'center'
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#A5B4FC" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#FFFFFF' }}>PUBLISH NEW BROADCAST</h3>
        </motion.div>

        {/* USER LEADERBOARD SECTION */}
        <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'center', margin: '20px 0 10px' }}>
           <span style={{ fontSize: 10, fontWeight: 900, color: '#4B5563', letterSpacing: 3, textTransform: 'uppercase' }}>Trader Leaderboard</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {(userLeaderboard.data || []).map((u, i) => {
            const cardThemeColor = i === 0 ? '#4ADE80' : i === 1 ? '#60A5FA' : i === 2 ? '#FBBF24' : '#94A3B8';
            return (
              <div key={u.uid} style={{ 
                background: 'rgba(31, 41, 55, 0.3)', borderRadius: '24px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${cardThemeColor}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: cardThemeColor }}>{i + 1}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: 'white' }}>{u.username}</div>
                    <div style={{ fontSize: 10, color: '#94A3B8' }}>{u.email}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>₹{u.portfolioValue?.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: 9, color: cardThemeColor, fontWeight: 800 }}>RANK {i + 1}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: '60px 0', textAlign: 'center', opacity: 0.2 }}>
          <p style={{ fontSize: '11px', color: '#FFFFFF', fontWeight: '800', letterSpacing: '4px', textTransform: 'uppercase' }}>Terminal Master Control</p>
        </div>
      </div>

      {/* NEWS PUBLISHING MODAL */}
      <AnimatePresence>
        {isNewsModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(20px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <div style={{ width: '100%', maxWidth: 500, background: '#111827', borderRadius: 32, padding: 32, border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#FFFFFF', margin: 0 }}>DRAFT NEWS</h2>
                <div onClick={() => setIsNewsModalOpen(false)} style={{ cursor: 'pointer', color: '#6B7280' }}>✕</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <input value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} placeholder="Headline" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 14, borderRadius: 16, color: 'white' }} />
                <textarea value={newsForm.body} rows={4} onChange={e => setNewsForm({...newsForm, body: e.target.value})} placeholder="Body..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: 14, borderRadius: 16, color: 'white', resize: 'none' }} />
                <button 
                  disabled={isPublishing || !newsForm.title || !newsForm.body}
                  onClick={async () => {
                    setIsPublishing(true);
                    const res = await publishArticle({
                      ...newsForm,
                      stock: newsForm.stock ? STOCKS.find(s => s.id === newsForm.stock).name : 'Global',
                      ticker: newsForm.stock ? STOCKS.find(s => s.id === newsForm.stock).ticker : 'N/A',
                      change: 'Pulse'
                    });
                    if (res.success) { setIsNewsModalOpen(false); setNewsForm({ title: '', body: '', cat: 'Trending', stock: '' }); }
                    setIsPublishing(false);
                  }}
                  style={{ width: '100%', padding: 18, borderRadius: 20, background: 'linear-gradient(90deg, #7C3AED, #4F46E5)', color: 'white', fontWeight: 900, border: 'none', cursor: 'pointer', opacity: (isPublishing || !newsForm.title || !newsForm.body) ? 0.5 : 1 }}
                >
                  {isPublishing ? 'PUBLISHING...' : 'PUBLISH REALTIME'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav active="home" />
    </div>
  );
};

export default AdminPanel;
