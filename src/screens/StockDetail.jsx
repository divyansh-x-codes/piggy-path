import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { useAppContext } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// ─── SEEDED PRNG: same chart every refresh, no random flickering ─────────────
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
function getStockSeed(id) {
  return id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) * 137;
}
// Deterministic history — Same stock+range = same chart. Trade impacts on top.
function getPriceHistory(stock, range, trades = []) {
  const pts = range === '1d' ? 24 : range === '6m' ? 24 : range === '1y' ? 52 : 104;
  const rng = seededRandom(getStockSeed(stock.id || 'x') + pts * 7);
  let base = stock.basePrice * 0.8;
  const hist = [];
  for (let i = 0; i < pts; i++) {
    base += base * (rng() * 0.04 - 0.018);
    hist.push(+base.toFixed(2));
  }
  // Apply trade impacts (Step impact logic for clear visual moves)
  let runPrice = hist[hist.length - 1];
  trades.forEach((t, ti) => {
    const idx = Math.max(pts - trades.length + ti, 0);
    const type = t.type || t.tradeType;
    const qty = t.quantity || 1;
    
    let delta;
    if (type === 'buy') {
      const impact = 0.012 + (qty * 0.0001);
      delta = runPrice * Math.min(impact, 0.15);
    } else {
      const impact = 0.009 + (qty * 0.00008);
      delta = -(runPrice * Math.min(impact, 0.15));
    }

    runPrice += delta;
    // Apply full delta to all points from the trade index onwards
    for (let j = idx; j < pts; j++) {
      hist[j] = +(hist[j] + delta).toFixed(2);
    }
  });

  return hist;
}

const StockDetail = () => {
  const {
    currentStock, goBack, goScreen, tradeHistory, globalTrades, portfolio,
    getPrice, marketHistory, userData, currentUser,
    updatePortfolio, updateBalance, recordTrade
  } = useAppContext();

  const [range, setRange] = useState('1d');
  const [tab, setTab] = useState('overview');
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState('buy');
  const [tradeQty, setTradeQty] = useState(1);
  const [showConfirm, setShowConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  // Chart: use globalTrades so ALL users see the SAME graph shape
  const stockTrades = globalTrades.filter(t => t.stockId === currentStock?.id);
  const chartHistory = marketHistory[currentStock?.id]?.length > 5
    ? marketHistory[currentStock?.id]
    : getPriceHistory(currentStock || { basePrice: 100, id: 'x' }, range, stockTrades);

  if (!currentStock) return null;

  const price = getPrice(currentStock);
  const isUp = chartHistory[chartHistory.length - 1] >= chartHistory[0];
  const color = isUp ? '#22C55E' : '#EF4444';
  const startPrice = chartHistory[0] || price;
  const chgPercent = (((price - startPrice) / startPrice) * 100).toFixed(2);

  const chartData = {
    labels: chartHistory.map(() => ''),
    datasets: [{
      data: chartHistory,
      borderColor: color,
      borderWidth: 2.5,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 4,
      fill: true,
      backgroundColor: color + '18',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: false },
      tooltip: { 
        mode: 'index', intersect: false,
        callbacks: { label: c => `₹ ${c.raw.toLocaleString()}` }
      }
    },
    scales: {
      x: { display: false },
      y: { display: false, grid: { display: false } }
    }
  };

  // Portfolio from Firestore (via context) — persists across refresh
  const holding = portfolio[currentStock.id];
  const qty = holding?.quantity || 0;
  const avgPrice = holding?.avgPrice || 0;
  const invested = qty * avgPrice;
  const currValue = price * qty;
  const pnl = currValue - invested;

  // ─── TRADE HANDLER — all state goes to Firestore via context ────────────────
  const handleConfirmTrade = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const totalCost = price * tradeQty;

      if (tradeType === 'buy') {
        if ((userData.balance || 0) < totalCost) {
          alert(`Insufficient balance! You need ₹${totalCost.toLocaleString()} but have ₹${(userData.balance || 0).toLocaleString()}`);
          setLoading(false);
          return;
        }

        const newQty = qty + tradeQty;
        // Average price calculation with strict numeric check
        const newAvgPrice = qty > 0 
          ? +((qty * avgPrice + totalCost) / newQty).toFixed(2)
          : +price.toFixed(2);

        // 1. Update portfolio in Firestore + context
        await updatePortfolio(currentStock.id, newQty, newAvgPrice);
        // 2. Deduct balance in Firestore + context
        await updateBalance(-totalCost);
        // 3. Record trade in Firestore (triggers global price update for all users)
        await recordTrade(currentStock.id, 'buy', tradeQty, price);

      } else {
        if (qty < tradeQty) {
          alert(`Not enough shares! You have ${qty} but want to sell ${tradeQty}`);
          setLoading(false);
          return;
        }
        const proceeds = price * tradeQty;
        const newQty = qty - tradeQty;

        await updatePortfolio(currentStock.id, newQty, avgPrice);
        await updateBalance(+proceeds);
        await recordTrade(currentStock.id, 'sell', tradeQty, price);
      }

      // Add a slight delay for better UX and to ensure state propagates
      await new Promise(r => setTimeout(r, 800));

      const msg = tradeType === 'buy'
        ? `✅ Bought ${tradeQty} share(s)!`
        : `✅ Sold ${tradeQty} share(s)!`;
      setShowConfirm(msg);
      setTimeout(() => { setTradeModalOpen(false); setShowConfirm(''); }, 1200);

    } catch (err) {
      console.error('[Trade Error]', err);
      alert('Trade failed: ' + (err.message || 'Please check your connection and try again.'));
    }
    setLoading(false);
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'white' }}>
        <div onClick={goBack} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'black' }}>{currentStock.name}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af' }}>{currentStock.ticker || currentStock.id.toUpperCase()}</div>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 40 }}>
        
        {/* Price Card with Graph */}
        <div style={{ margin: '0 16px 20px', border: '1.5px solid var(--border)', borderRadius: 24, padding: '24px 0 16px', overflow: 'hidden' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: (currentStock.color || '#7C3AED') + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, color: currentStock.color || '#7C3AED' }}>
              {typeof currentStock.logo === 'string' && currentStock.logo.length <= 3 ? currentStock.logo : currentStock.name.substring(0, 2).toUpperCase()}
            </div>
          </div>
          
          <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 32, textAlign: 'center', marginBottom: 4, color: 'black' }}>
            ₹ {price.toLocaleString()}
          </p>
          <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 700, color: isUp ? '#22c55e' : '#ef4444', marginBottom: 16 }}>
            {isUp ? '▲ +' : '▼ '}{Math.abs(Number(chgPercent)).toFixed(2)}%
          </div>

          {/* THE GRAPH — using getPriceHistory from HTML */}
          <div style={{ position: 'relative', width: '100%', height: 160, marginBottom: 12 }}>
            <Line key={`${currentStock.id}-${range}`} data={chartData} options={chartOptions} />
          </div>

          {/* Range Buttons */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: '0 16px' }}>
            {[['1d', 'Current'], ['6m', '6 MON'], ['1y', '12 MON']].map(([r, label]) => (
              <button key={r} onClick={() => setRange(r)} style={{ padding: '8px 18px', borderRadius: 50, fontSize: 11, fontWeight: 700, cursor: 'pointer', border: range === r ? 'none' : '1px solid #e5e7eb', background: range === r ? '#7C3AED' : 'white', color: range === r ? 'white' : 'black' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* BUY / SELL / NEWS */}
        <div style={{ display: 'flex', gap: 10, margin: '0 16px 20px' }}>
          <button onClick={() => { setTradeType('buy'); setTradeQty(1); setShowConfirm(''); setTradeModalOpen(true); }} style={{ flex: 1.2, padding: '15px 0', borderRadius: 50, background: '#22c55e', color: 'white', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer' }}>BUY</button>
          <button onClick={() => { setTradeType('sell'); setTradeQty(1); setShowConfirm(''); setTradeModalOpen(true); }} style={{ flex: 1.2, padding: '15px 0', borderRadius: 50, background: '#7C3AED', color: 'white', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer' }}>SELL</button>
          <button onClick={() => goScreen('news')} style={{ flex: 1, padding: '15px 0', borderRadius: 50, background: 'white', color: 'black', fontWeight: 700, fontSize: 15, border: '1px solid #e5e7eb', cursor: 'pointer' }}>News</button>
        </div>

        {/* PREMIUM RESEARCH BUTTON */}
        {RESEARCH_REPORTS[currentStock.id] && (
          <div style={{ margin: '0 16px 20px' }}>
            <button 
              onClick={() => goScreen('analysis')}
              style={{ 
                width: '100%', padding: '16px', borderRadius: 20, 
                background: 'linear-gradient(90deg, #121212 0%, #1a1a1a 100%)', 
                border: '1px solid rgba(124, 58, 237, 0.3)', color: 'white', 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ background: '#7C3AED', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>Deep Dive Research</div>
                  <div style={{ fontSize: 10, opacity: 0.6, fontWeight: 600 }}>Institutional Analysis Report</div>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="3"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        )}

        {/* Tabs */}
        <div style={{ margin: '0 16px 20px', background: '#f3f4f6', borderRadius: 50, padding: 4, display: 'flex' }}>
          {['overview', 'fundamentals'].map(t => (
            <div key={t} onClick={() => setTab(t)} style={{ flex: 1, textAlign: 'center', padding: '12px 0', borderRadius: 50, fontWeight: 700, fontSize: 13, cursor: 'pointer', background: tab === t ? '#7C3AED' : 'transparent', color: tab === t ? 'white' : '#6b7280', transition: 'all 0.2s', textTransform: 'capitalize' }}>
              {t}
            </div>
          ))}
        </div>

        <div style={{ padding: '0 16px' }}>
          {tab === 'overview' ? (
            <div>
              {/* YOUR POSITION */}
              <h3 style={{ fontWeight: 800, fontSize: 16, color: 'black', marginBottom: 12 }}>Your Holdings</h3>
              {qty === 0 ? (
                <div style={{ padding: 20, border: '1px dashed #d1d5db', borderRadius: 20, textAlign: 'center', marginBottom: 24 }}>
                  <p style={{ color: '#9ca3af', fontSize: 13, fontWeight: 500, margin: 0 }}>You don't own any {currentStock.name} yet. Click BUY to start!</p>
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: 20, padding: 20, border: '1.5px solid #e5e7eb', marginBottom: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    {[
                      { label: 'Quantity', value: qty },
                      { label: 'Invested', value: `₹ ${invested.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                      { label: 'Current Value', value: `₹ ${currValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                      { label: 'P&L', value: `${pnl >= 0 ? '+' : ''}₹ ${Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: pnl >= 0 ? '#22c55e' : '#ef4444' }
                    ].map(({ label, value, color: c }) => (
                      <div key={label}>
                        <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
                        <p style={{ fontWeight: 800, fontSize: 17, color: c || 'black', margin: 0 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700 }}>AVG PRICE</span>
                    <span style={{ fontSize: 12, color: 'black', fontWeight: 800 }}>₹ {avgPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* Key Stats */}
              <h3 style={{ fontWeight: 800, fontSize: 16, color: 'black', marginBottom: 12 }}>Key Statistics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[
                  { k: 'Volume', v: currentStock.volume },
                  { k: 'Avg Price', v: `₹ ${currentStock.avgPrice?.toLocaleString()}` },
                  { k: 'P/E Ratio', v: currentStock.pe },
                  { k: 'Market Cap', v: currentStock.mktCap }
                ].map(({ k, v }) => (
                  <div key={k} style={{ background: '#f9fafb', borderRadius: 16, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'black' }}>{v}</div>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.6, marginBottom: 24, fontWeight: 500 }}>
                {currentStock.desc}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { k: 'P/E Ratio', v: currentStock.pe },
                { k: 'EPS', v: `₹ ${currentStock.eps}` },
                { k: 'Market Cap', v: currentStock.mktCap },
                { k: 'Sector', v: currentStock.sector }
              ].map(({ k, v }) => (
                <div key={k} style={{ background: '#f9fafb', borderRadius: 16, padding: '16px' }}>
                  <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 700, marginBottom: 6 }}>{k}</div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: 'black' }}>{v}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trade Modal */}
      {tradeModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.55)', zIndex: 100, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: '28px 28px 0 0', padding: '28px 24px 36px', width: '100%', maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontWeight: 800, fontSize: 20, color: 'black', margin: 0 }}>{tradeType === 'buy' ? 'Buy Asset' : 'Sell Position'}</h3>
              <div onClick={() => setTradeModalOpen(false)} style={{ width: 40, height: 40, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>✕</div>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginBottom: 4 }}>Market Execution Price</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 34, color: 'black' }}>₹ {price.toLocaleString()}</div>
            </div>
            
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: 'black', marginBottom: 8, display: 'block' }}>Quantity Configuration</label>
              <input type="number" value={tradeQty} min="1" onChange={(e) => setTradeQty(Number(e.target.value) || 1)} style={{ width: '100%', padding: '14px 18px', borderRadius: 14, border: '1px solid #e5e7eb', fontSize: 18, fontWeight: 700, boxSizing: 'border-box', background: '#f9fafb', outline: 'none' }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6b7280' }}>Estimated Total</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: 'black' }}>₹ {(price * tradeQty).toFixed(2)}</span>
            </div>

            {tradeType === 'buy' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, padding: '10px 14px', background: '#f0fdf4', borderRadius: 12 }}>
                <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Available Balance</span>
                <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 800 }}>₹ {Number(userData.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            )}
            
            <button onClick={handleConfirmTrade} disabled={loading} style={{ width: '100%', padding: 18, borderRadius: 50, background: loading ? '#9ca3af' : tradeType === 'buy' ? '#22c55e' : '#7C3AED', color: 'white', fontWeight: 800, fontSize: 16, border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Processing...' : `Confirm ${tradeType === 'buy' ? 'Buy' : 'Sell'} Order`}
            </button>
            
            {showConfirm && (
              <div style={{ textAlign: 'center', marginTop: 14, fontSize: 14, fontWeight: 800, color: tradeType === 'buy' ? '#22c55e' : '#7C3AED' }}>
                {showConfirm}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetail;
