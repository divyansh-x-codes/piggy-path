import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAppContext } from '../context/AppContext';
import { RESEARCH_REPORTS } from '../data/mockData';

import { useParams, useNavigate } from 'react-router-dom';

const StockDetail = () => {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const {
    portfolio, getPrice, getChange, userData,
    confirmTrade, STOCKS, resetData, isAdmin
  } = useAppContext();

  // ─── ALL STATE ──────────────────────────────────────────────────────────
  const [tab, setTab] = useState('overview');
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState('buy');
  const [tradeQty, setTradeQty] = useState(1);
  const [showConfirm, setShowConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [liveStock, setLiveStock] = useState(null);

  // ─── REAL-TIME PRICE & HISTORY LISTENER ────────────────────────────────
  useEffect(() => {
    if (!stockId) return;

    console.log("[Firestore] Subscribing to stockId:", stockId);
    const unsub = onSnapshot(doc(db, 'stocks', stockId.toLowerCase()), (snap) => {
      if (snap.exists()) {
        console.log("[Firestore] Live update for", stockId, snap.data().price);
        setLiveStock({ id: snap.id, ...snap.data() });
      } else {
        console.warn("[Firestore] Stock not found:", stockId);
      }
    }, (err) => {
      console.error("Stock Detail Sync Error:", err);
    });

    return () => unsub();
  }, [stockId]);

  // Find the base metadata from mock STOCKS to keep UI rich (colors, etc.)
  const currentStock = STOCKS.find(s => s.id === stockId) || liveStock;

  // ─── EARLY RETURN — only AFTER all hooks ─────────────────────────────────
  if (!currentStock) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading stock details...</div>;

  // ─── DERIVED DATA ────────────────────────────────────────────────────────
  const sid = (currentStock.id || '').toLowerCase();
  const price = (liveStock?.price) || getPrice(currentStock) || 0;
  const chgPercent = (liveStock ? ((liveStock.price - (currentStock.basePrice || 100)) / (currentStock.basePrice || 100) * 100) : getChange(currentStock)) || 0;

  // Real-time graph: history array lives in Firestore stock doc
  const rawHistory = Array.isArray(liveStock?.history) ? liveStock.history : [];

  // GUARANTEED RENDERING — Chart.js needs 2+ points to draw a line
  // If we only have 1 point, synthesize a "previous" point to give it some shape
  const safeGraphData = rawHistory.length > 1
    ? rawHistory
    : (rawHistory.length === 1 
        ? [rawHistory[0] * 0.995, rawHistory[0]] 
        : [price * 0.995, price]);

  const startPrice = safeGraphData[0] || price || 0;
  const isUp = price >= startPrice;
  const color = isUp ? '#22C55E' : '#EF4444';

  const chartData = {
    labels: safeGraphData.map(() => ''),
    datasets: [{
      data: safeGraphData,
      borderColor: color,
      borderWidth: 2,
      tension: 0.35,
      pointRadius: 0,
      fill: true,
      backgroundColor: color + '12',
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1000, easing: 'easeInOutQuart' },
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

  // Portfolio holdings
  const holding = (portfolio?.holdings || {})[sid] || { qty: 0, avgPrice: 0 };
  const qty = holding.qty || 0;
  const avgPrice = holding.avgPrice || 0;
  const invested = avgPrice * qty;
  const currValue = price * qty;
  const pnl = currValue - invested;

  // ─── TRADE HANDLER ────────────────────────────────────────────────────────
  const handleConfirmTrade = async () => {
    if (loading) return;
    setLoading(true);
    console.log("[Trade] Starting trade:", tradeType, stockId, tradeQty);
    
    try {
      const result = await confirmTrade(tradeType, stockId, tradeQty);
      console.log("[Trade] Result:", result);

      if (!result.success) {
        alert("Transaction Failed: " + (result.error || "Unknown Error"));
        setLoading(false);
        return;
      }

      const msg = tradeType === 'buy'
        ? `✅ Successfully bought ${tradeQty} share(s)!`
        : `✅ Successfully sold ${tradeQty} share(s)!`;
      setShowConfirm(msg);
      
      // Keep loading true while the success message is shown
      setTimeout(() => { 
        setTradeModalOpen(false); 
        setShowConfirm(''); 
        setLoading(false);
      }, 1500);
      
    } catch (err) {
      console.error("[Trade] Critical Error:", err);
      alert('System error during trade. Please try again or refresh.');
      setLoading(false);
    } finally {
      // If we didn't show the success confirm message, we must reset loading now
      // Success path handles its own reset via the timeout above
    }
  };

  const goBack = () => navigate(-1);
  const goScreen = (scr) => navigate(`/${scr}`);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'white' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div onClick={goBack} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </div>
          {isAdmin && (
            <div onClick={async () => {
              if (window.confirm("RESET EVERYTHING?")) {
                await resetData();
              }
            }} style={{ width: 44, height: 44, borderRadius: '50%', border: '1px solid #fee2e2', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </div>
          )}
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
        <div style={{ margin: '0 16px 20px', border: '1.5px solid #e5e7eb', borderRadius: 24, padding: '24px 0 16px', overflow: 'hidden' }}>

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

          {/* THE GRAPH */}
          <div style={{ position: 'relative', width: '100%', height: 160, marginBottom: 12 }}>
            <Line key={`${currentStock.id}`} data={chartData} options={chartOptions} />
          </div>

          {/* Live Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e', animation: 'pulse 2s infinite' }}></div>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#22c55e', letterSpacing: '1px' }}>LIVE MARKET</span>
          </div>

          <style>{`
            @keyframes pulse {
              0% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(1.2); }
              100% { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>

        {/* BUY / SELL / NEWS */}
        <div style={{ display: 'flex', gap: 10, margin: '0 16px 20px' }}>
          <button onClick={() => { setTradeType('buy'); setTradeQty(1); setShowConfirm(''); setTradeModalOpen(true); }} style={{ flex: 1.2, padding: '15px 0', borderRadius: 50, background: '#22c55e', color: 'white', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer' }}>BUY</button>
          <button onClick={() => { setTradeType('sell'); setTradeQty(1); setShowConfirm(''); setTradeModalOpen(true); }} style={{ flex: 1.2, padding: '15px 0', borderRadius: 50, background: '#7C3AED', color: 'white', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer' }}>SELL</button>
          <button onClick={() => goScreen('news')} style={{ flex: 1, padding: '15px 0', borderRadius: 50, background: 'white', color: 'black', fontWeight: 700, fontSize: 15, border: '1px solid #e5e7eb', cursor: 'pointer' }}>News</button>
        </div>

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
              {/* YOUR HOLDINGS */}
              <h3 style={{ fontWeight: 800, fontSize: 18, color: 'black', marginBottom: 16 }}>Your Holdings</h3>
              {qty === 0 ? (
                <div style={{ padding: 24, border: '1.5px dashed #cbd5e1', borderRadius: 24, textAlign: 'center', marginBottom: 32, background: 'rgba(248, 250, 252, 0.5)' }}>
                  <p style={{ color: '#64748b', fontSize: 13, fontWeight: 600, margin: 0 }}>You don't own any {currentStock.name} yet. Click BUY to start!</p>
                </div>
              ) : (
                <div style={{ background: 'white', borderRadius: 24, padding: 24, border: '1.5px solid #e2e8f0', marginBottom: 32, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    {[
                      { label: 'Quantity', value: qty },
                      { label: 'Invested', value: `₹ ${invested.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                      { label: 'Current Value', value: `₹ ${currValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                      { label: 'P&L', value: `${pnl >= 0 ? '+' : ''}₹ ${Math.abs(pnl).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: pnl >= 0 ? '#22c55e' : '#ef4444' }
                    ].map(({ label, value, color: c }) => (
                      <div key={label}>
                        <p style={{ fontSize: 10, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
                        <p style={{ fontWeight: 900, fontSize: 18, color: c || '#0f172a', margin: 0 }}>{value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, color: '#64748b', fontWeight: 800, textTransform: 'uppercase' }}>AVG PRICE</span>
                    <span style={{ fontSize: 14, color: '#0f172a', fontWeight: 900 }}>₹ {avgPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {/* KEY STATISTICS */}
              <h3 style={{ fontWeight: 800, fontSize: 18, color: 'black', marginBottom: 16 }}>Key Statistics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
                {[
                  { k: 'Volume', v: currentStock.volume || '15.4L' },
                  { k: 'Avg Price', v: `₹ ${currentStock.basePrice || 80}` },
                  { k: 'P/E Ratio', v: currentStock.pe || 'Pre-Rev' },
                  { k: 'Market Cap', v: currentStock.mktCap || '8.0 Cr' }
                ].map(item => (
                  <div key={item.k} style={{ background: '#f8fafc', padding: 20, borderRadius: 24, border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: 10, color: '#64748b', fontWeight: 800, margin: '0 0 6px 0', textTransform: 'uppercase' }}>{item.k}</p>
                    <p style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>{item.v}</p>
                  </div>
                ))}
              </div>

              {/* DETAILED SCORECARD INTEGRATION */}
              {RESEARCH_REPORTS[stockId] && (() => {
                const report = RESEARCH_REPORTS[stockId];
                
                // NEW: Support for full HTML reports
                if (report.fullReportHtml) {
                  return (
                    <div 
                      className="full-html-report"
                      dangerouslySetInnerHTML={{ __html: report.fullReportHtml }} 
                      style={{ marginTop: 20 }}
                    />
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                    
                    {/* MARKET OPPORTUNITY header */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                        <div style={{ width: 4, height: 20, background: '#7C3AED', borderRadius: 2 }}></div>
                        <h3 style={{ fontWeight: 800, fontSize: 18, color: 'black', margin: 0 }}>Market Opportunity & Targets</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {report.metrics.slice(0, 4).map((m, i) => (
                          <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 24, padding: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
                            <div style={{ fontSize: 22, fontWeight: 900, color: i % 2 === 0 ? '#10b981' : '#f59e0b' }}>{m.value}</div>
                            <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, marginTop: 4 }}>{m.sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* SWOT ANALYSIS - PROPER SHARP BOXES */}
                    <div style={{ display: 'flex', gap: 10 }}>
                      <div style={{ flex: 1, border: '1px solid #deeefc', background: '#f5faff', padding: '16px' }}>
                        <div style={{ fontSize: 10, color: '#334155', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.8px' }}>OPPORTUNITIES</div>
                        {report.swot.opportunities.map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, lineHeight: 1.4, marginBottom: 10, fontWeight: 500, color: '#0f172a' }}>
                            <span style={{ color: '#0369a1' }}>•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ flex: 1, border: '1px solid #f9edd9', background: '#fff9ed', padding: '16px' }}>
                        <div style={{ fontSize: 10, color: '#334155', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.8px' }}>THREATS</div>
                        {report.swot.threats.map((item, i) => (
                          <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11, lineHeight: 1.4, marginBottom: 10, fontWeight: 500, color: '#0f172a' }}>
                            <span style={{ color: '#92400e' }}>•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* WHY UNIQUE - ACCENT BAR */}
                    <div style={{ borderLeft: '5px solid #0f172a', paddingLeft: 16 }}>
                      <div style={{ fontSize: 10, color: '#334155', fontWeight: 800, textTransform: 'uppercase', marginBottom: 12, letterSpacing: '0.8px' }}>{report.uniquenessTitle || "WHAT MAKES XADS UNIQUE VS. THE MEDIA ANT / MYHOARDINGS"}</div>
                      <p style={{ fontSize: 12, color: 'black', lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                        {report.uniquenessProposition}
                      </p>
                    </div>

                    {/* FINANCIALS & CHART SECTION */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                      <div>
                        <div style={{ fontSize: 10, color: '#334155', fontWeight: 800, textTransform: 'uppercase', marginBottom: 16, letterSpacing: '0.8px' }}>FINANCIAL SNAPSHOT</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {(report.financialSnapshot || []).map((s, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: i === report.financialSnapshot.length - 1 ? 'none' : '1px solid #f1f5f9' }}>
                              <span style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>{s.label}</span>
                              <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Revenue Chart - IMAGE ONLY */}
                      <div style={{ background: 'white', borderRadius: 24, padding: report.graphImage ? '12px 0 24px' : '32px 24px', border: report.graphImage ? 'none' : '1.5px solid #e2e8f0', marginBottom: 32, textAlign: 'center' }}>
                        {report.graphImage ? (
                          <div style={{ width: '100%', overflow: 'hidden' }}>
                            <img src={report.graphImage} alt="Revenue Projection" style={{ width: '100%', display: 'block' }} />
                          </div>
                        ) : (
                          <div style={{ padding: '40px 0' }}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>REVENUE PROJECTION</div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>DATA UNDER REVIEW</div>
                          </div>
                        )}
                      </div>

                      {/* Quant Score & Risk Analysis */}
                      {(report.quantScore || report.riskRegister) && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 16, marginBottom: 32 }}>
                          {/* Quant Score Card */}
                          {report.quantScore && (
                            <div style={{ background: 'white', borderRadius: 24, padding: 24, border: '1.5px solid #e2e8f0' }}>
                              <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>QUANT SCORE</div>
                              <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 56, fontWeight: 950, color: '#10b981', lineHeight: 1, fontFamily: "'DM Serif Display', serif" }}>{report.quantScore.total}</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginTop: 8 }}>out of 100 &nbsp;·&nbsp; Grade: <span style={{ color: '#10b981' }}>{report.quantScore.grade}</span></div>
                                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, margin: '24px 0 12px', overflow: 'hidden' }}>
                                  <div style={{ height: '100%', width: `${report.quantScore.total}%`, background: '#10b981', borderRadius: 4 }}></div>
                                </div>
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 20 }}>
                                {Object.entries(report.quantScore.subScores).map(([key, val]) => (
                                  <div key={key} style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                      <span style={{ textTransform: 'capitalize', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{key}</span>
                                      <span style={{ color: val > 60 ? '#10b981' : '#f59e0b' }}>{val}</span>
                                    </div>
                                    <div style={{ height: 3, background: '#f1f5f9', borderRadius: 1.5 }}>
                                      <div style={{ height: '100%', width: `${val}%`, background: val > 60 ? '#10b981' : '#f59e0b', borderRadius: 1.5 }}></div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Risk Register Card */}
                          {report.riskRegister && (
                            <div style={{ background: 'white', borderRadius: 24, padding: 24, border: '1.5px solid #e2e8f0' }}>
                              <div style={{ fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: 20 }}>RISK REGISTER</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {report.riskRegister.map((risk, idx) => (
                                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottom: '1px solid #f8fafc' }}>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#334155' }}>{risk.name}</span>
                                    <span style={{ 
                                      fontSize: 10, 
                                      fontWeight: 800, 
                                      padding: '4px 8px', 
                                      borderRadius: 12, 
                                      background: risk.level === 'HIGH' ? '#fef2f2' : (risk.level === 'MEDIUM' ? '#fffbeb' : '#f0fdf4'),
                                      color: risk.level === 'HIGH' ? '#ef4444' : (risk.level === 'MEDIUM' ? '#d97706' : '#16a34a')
                                    }}>{risk.level}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* MILESTONES / TRACTION SECTION */}
                    <div>
                      <div style={{ fontSize: 10, color: '#334155', fontWeight: 800, textTransform: 'uppercase', marginBottom: 24, letterSpacing: '0.8px' }}>{report.milestonesTitle || "PILOT MILESTONES (BENGALURU)"}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
                        {report.milestones.map((m, i) => (
                          <div key={i} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 950, color: (i === 3 || i === 4) ? '#10b981' : (i === 5 ? '#f59e0b' : (i === 0 ? '#c2410c' : '#0f172a')), fontFamily: "'DM Serif Display', serif" }}>{m.value}</div>
                            <div style={{ fontSize: 9, fontWeight: 800, marginTop: 6, textTransform: 'uppercase', color: '#334155', opacity: 0.8, letterSpacing: '0.5px' }}>{m.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DYNAMIC ALERT BOX */}
                    <div style={{ marginBottom: 32, padding: '16px 20px', background: report.alert?.type === 'ISA WATCH' ? '#fffbeb' : '#f8fafc', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start', border: report.alert?.type === 'ISA WATCH' ? '1px solid #fef3c7' : '1px solid #f1f5f9' }}>
                      <div style={{ color: report.alert?.type === 'ISA WATCH' ? '#d97706' : '#0f172a', marginTop: 2 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12" y2="17.01"></line></svg>
                      </div>
                      <p style={{ fontSize: 11, lineHeight: 1.5, fontWeight: 700, color: report.alert?.type === 'ISA WATCH' ? '#92400e' : '#0f172a', margin: 0 }}>
                        <span style={{ textTransform: 'uppercase' }}>{report.alert?.type || "Institutional Alert"}:</span> {report.alert?.text || "Due diligence is critical. Projections are based on current market velocity and verified traction data. Churn and unit economics must be tracked quarterly."}
                      </p>
                    </div>

                    {/* CAP STRUCTURE & DEAL TERMS */}
                    {report.dealTerms && (
                      <div style={{ padding: 32, background: '#1e293b', borderRadius: 24, color: 'white' }}>
                        <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 24, letterSpacing: '0.8px' }}>CAP STRUCTURE & DEAL TERMS</div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
                          {[...(report.dealTerms.founders || []), ...(report.dealTerms.others || [])].map((item, idx) => (
                            <div key={idx} style={{ 
                              background: 'rgba(255,255,255,0.05)', 
                              borderRadius: 16, 
                              padding: '16px 8px', 
                              textAlign: 'center',
                              border: item.name === 'THIS RAISE' ? '1px solid #3b82f6' : 'none'
                            }}>
                              <div style={{ fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 }}>{item.name}</div>
                              <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 2, color: item.name === 'THIS RAISE' ? '#3b82f6' : 'white' }}>{item.stake}</div>
                              <div style={{ fontSize: 8, color: '#64748b', textTransform: 'uppercase' }}>{item.role}</div>
                            </div>
                          ))}
                        </div>

                        {/* Summary Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                           <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12 }}>
                             <div style={{ fontSize: 8, fontWeight: 800, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>INSTRUMENT</div>
                             <div style={{ fontSize: 12, fontWeight: 700 }}>{report.dealTerms.instrument}</div>
                           </div>
                           <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12 }}>
                             <div style={{ fontSize: 8, fontWeight: 800, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>MIN. TICKET</div>
                             <div style={{ fontSize: 12, fontWeight: 700 }}>{report.dealTerms.minTicket}</div>
                           </div>
                           <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12 }}>
                             <div style={{ fontSize: 8, fontWeight: 800, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>IPO PRICE</div>
                             <div style={{ fontSize: 12, fontWeight: 700 }}>{report.dealTerms.virtualIpoPrice}</div>
                           </div>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })()}
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
              <h3 style={{ fontWeight: 800, fontSize: 20, color: 'black', margin: 0 }}>{tradeType === 'buy' ? 'Buy ' : 'Sell '}{currentStock.name}</h3>
              <div onClick={() => setTradeModalOpen(false)} style={{ width: 40, height: 40, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>✕</div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginBottom: 4 }}>Current Price</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 34, color: 'black' }}>₹ {price.toLocaleString()}</div>
            </div>

            {/* QUANTITY INPUT - FLEXIBLE & LIMIT AWARE */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: 'black' }}>Quantity</label>
                {tradeType === 'buy' && (
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#64748B' }}>
                    Max per order: 10
                  </span>
                )}
              </div>
              <input 
                type="number" 
                value={tradeQty} 
                min="0"
                max={tradeType === 'buy' ? 10 : qty}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') { setTradeQty(''); return; }
                  setTradeQty(parseInt(val) || 0);
                }} 
                style={{ 
                  width: '100%', padding: '14px 18px', borderRadius: 14, 
                  border: '1px solid #e5e7eb', fontSize: 18, fontWeight: 700, 
                  boxSizing: 'border-box', background: '#f9fafb', outline: 'none' 
                }} 
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#6b7280' }}>Total Cost</span>
              <span style={{ fontWeight: 800, fontSize: 18, color: 'black' }}>₹ {(price * (Number(tradeQty) || 0)).toFixed(2)}</span>
            </div>

            {tradeType === 'buy' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, padding: '10px 14px', background: '#f0fdf4', borderRadius: 12 }}>
                <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Available Balance</span>
                <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 800 }}>₹ {Number(userData.balance || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            )}

            {tradeType === 'sell' && qty > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, padding: '10px 14px', background: '#faf5ff', borderRadius: 12 }}>
                <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 600 }}>Shares Owned</span>
                <span style={{ fontSize: 12, color: '#7c3aed', fontWeight: 800 }}>{qty} shares</span>
              </div>
            )}

            {/* ERROR MESSAGE IF ORDER LIMIT EXCEEDED */}
            {tradeType === 'buy' && (Number(tradeQty) > 10) && (
               <div style={{ color: '#EF4444', fontSize: 11, fontWeight: 800, textAlign: 'center', marginBottom: 12 }}>
                 ⚠️ MAX 10 SHARES PER ORDER
               </div>
            )}

            <button
              disabled={!!showConfirm || loading}
              onClick={handleConfirmTrade}
              style={{
                width: '100%',
                padding: 18,
                borderRadius: 50,
                background: tradeType === 'buy' ? '#22c55e' : '#7C3AED',
                color: 'white',
                fontWeight: 800,
                fontSize: 16,
                border: 'none',
                cursor: (showConfirm || loading) ? 'not-allowed' : 'pointer',
                opacity: (showConfirm || loading) ? 0.7 : 1
              }}
            >
              {loading ? 'Processing...' : `Confirm ${tradeType === 'buy' ? 'Buy' : 'Sell'}`}
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
