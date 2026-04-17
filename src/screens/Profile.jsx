import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BottomNav } from '../components/Shared';
import { STOCKS } from '../data/mockData';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Profile = () => {
  const navigate = useNavigate();
  const { userData, portfolio, tradeHistory, getPrice, user } = useAppContext();
  const [leaderboard, setLeaderboard] = React.useState(null);

  // Calculate portfolio stats
  const holdings = portfolio.holdings || {};
  const portfolioEntries = Object.entries(holdings).filter(([, h]) => (h.qty || 0) > 0);
  const totalInvested = portfolioEntries.reduce((sum, [, h]) => sum + ((h.qty || 0) * (h.avgPrice || 0)), 0);
  const totalCurrentValue = portfolioEntries.reduce((sum, [id, h]) => {
    const stock = STOCKS.find(s => s.id === id);
    const price = stock ? getPrice(stock) : 0;
    return sum + price * (h.qty || 0);
  }, 0);
  const totalPnL = totalCurrentValue - totalInvested;
  const pnlPercent = totalInvested > 0 ? ((totalPnL / totalInvested) * 100).toFixed(2) : '0.00';

  // Realtime Leaderboard Listener
  // One-time Leaderboard Fetch
  React.useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const snap = await getDoc(doc(db, 'leaderboard', 'global'));
        if (snap.exists()) setLeaderboard(snap.data());
      } catch (err) { console.error("Leaderboard fetch error:", err); }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', paddingTop: 24, zIndex: 10 }}>
        {/* Back Button */}
        <div onClick={() => navigate('/home')} style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>

        {/* Name Block */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <span style={{ fontSize: 24, fontWeight: 700, color: 'black', letterSpacing: '0.2px' }}>{user?.displayName || 'Investor'}</span>
            <span style={{ fontSize: 9, marginTop: 4, marginLeft: 2, color: 'black', fontWeight: 600 }}>#546677</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginTop: -4, letterSpacing: '0.2px', textTransform: 'lowercase' }}>{user?.email || 'piggyspark@fin.com'}</div>
        </div>

        {/* Hamburger Menu */}
        <div style={{ padding: 8 }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>

        {/* Hero Card */}
        <div style={{ margin: '0 20px', marginTop: 10, position: 'relative' }}>
          <div style={{ background: 'white', borderRadius: 32, border: '2.5px solid black', boxShadow: '0px 18px 40px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden', minHeight: 280 }}>

            {/* Avatar Wrapper */}
            <div style={{ position: 'absolute', right: 15, top: 20, bottom: 20, width: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
              <video src="/r.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
            </div>

            {/* Left side Content Wrapper */}
            <div style={{ position: 'relative', zIndex: 2, padding: 20, width: '58%' }}>

              {/* Level Box */}
              <div style={{ border: '1.5px solid #e2e8f0', borderRadius: 8, background: 'white', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 26, height: 26, background: '#fbbf24', border: '1.5px solid black', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 14 }}>0</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'black' }}>Level 0</div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 600, marginTop: 1 }}>#546677</div>
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'black', marginBottom: 4 }}>Hello Investor 👋</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: '#64748b', fontStyle: 'italic', lineHeight: 1.4, marginBottom: 12, maxWidth: '90%' }}>
                "{[
                  "The best time to invest was yesterday. The second best time is now.",
                  "Rule No. 1: Never lose money. Rule No. 2: Never forget rule No. 1.",
                  "The stock market transfers money from the impatient to the patient.",
                  "In investing, what is comfortable is rarely profitable.",
                  "Risk comes from not knowing what you're doing."
                ][Math.floor(Math.random() * 5)]}"
              </div>


              {/* Divider */}
              <div style={{ height: '1.5px', background: '#e2e8f0', width: '100%', marginBottom: 12 }}></div>




            </div>
          </div>
        </div>

        {/* ── INVESTMENT SUMMARY ────────────────────────────────────────── */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{ background: 'white', border: '2px solid black', borderRadius: 24, padding: '20px' }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Investment Summary</div>

            {/* 4 Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { label: 'Balance', value: `₹ ${Number(userData.balance || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: '#7C3AED' },
                { label: 'Total Invested', value: `₹ ${totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: 'black' },
                { label: 'Current Value', value: `₹ ${totalCurrentValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: 'black' },
                { label: 'Overall P&L', value: `${totalPnL >= 0 ? '+' : ''}₹ ${Math.abs(totalPnL).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: totalPnL >= 0 ? '#22c55e' : '#ef4444' }
              ].map(({ label, value, color }) => (
                <div key={label} style={{ background: '#f9fafb', borderRadius: 16, padding: '14px' }}>
                  <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color }}>{value}</div>
                </div>
              ))}
            </div>

            {/* P&L % bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 14, background: totalPnL >= 0 ? '#f0fdf4' : '#fef2f2' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: totalPnL >= 0 ? '#16a34a' : '#dc2626' }}>
                {totalPnL >= 0 ? '▲' : '▼'} {Math.abs(pnlPercent)}% return
              </span>
              <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>{portfolioEntries.length} stock(s)</span>
            </div>
          </div>
        </div>

        {/* ── MARKET LEADERBOARD (NEW) ────────────────────────────────── */}
        <div style={{ margin: '16px 20px 0' }}>
          <div style={{ background: 'white', border: '2px solid black', borderRadius: 24, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Market Performers 🏆</div>
              <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, background: '#f0fdf4', padding: '4px 8px', borderRadius: 8 }}>REALTIME</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {/* Top Gainer */}
              <div style={{ background: '#f0fdf4', borderRadius: 16, padding: '12px', border: '1px solid #16a34a22' }}>
                <div style={{ fontSize: 9, color: '#16a34a', fontWeight: 800, marginBottom: 4 }}>TOP GAINER 🚀</div>
                {leaderboard?.topGainers?.[0] ? (
                  <>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{leaderboard.topGainers[0].symbol}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#16a34a' }}>+{leaderboard.topGainers[0].change.toFixed(2)}%</div>
                  </>
                ) : <div style={{ fontSize: 10, opacity: 0.5 }}>Loading...</div>}
              </div>

              {/* Top Loser */}
              <div style={{ background: '#fef2f2', borderRadius: 16, padding: '12px', border: '1px solid #dc262622' }}>
                <div style={{ fontSize: 9, color: '#dc2626', fontWeight: 800, marginBottom: 4 }}>TOP LOSER 📉</div>
                {leaderboard?.topLosers?.[0] ? (
                  <>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{leaderboard.topLosers[0].symbol}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#dc2626' }}>{leaderboard.topLosers[0].change.toFixed(2)}%</div>
                  </>
                ) : <div style={{ fontSize: 10, opacity: 0.5 }}>Loading...</div>}
              </div>
            </div>

            {leaderboard && (
              <div onClick={() => navigate('/stocks')} style={{ marginTop: 12, textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#7C3AED', cursor: 'pointer' }}>
                Analyze all {STOCKS.length} stocks →
              </div>
            )}
          </div>
        </div>

        {/* ── PER-STOCK HOLDINGS ────────────────────────────────────────── */}
        {portfolioEntries.length > 0 && (
          <div style={{ margin: '16px 20px 0' }}>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 12 }}>My Holdings</div>
            {portfolioEntries.map(([id, h]) => {
              const stock = STOCKS.find(s => s.id === id);
              if (!stock) return null;
              const currPrice = getPrice(stock);
              const qty = h.qty || 0;
              const avgP = h.avgPrice || 0;
              const inv = qty * avgP;
              const currVal = currPrice * qty;
              const pnl = currVal - inv;
              const isUp = pnl >= 0;
              return (
                <div key={id} onClick={() => navigate(`/stock/${id}`)} style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 20, padding: '16px', marginBottom: 10, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: (stock.color || '#7C3AED') + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: stock.color || '#7C3AED' }}>
                        {(stock.logo || stock.name.substring(0, 2)).toString().substring(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 14 }}>{stock.name}</div>
                        <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600 }}>{qty} shares · avg ₹{avgP.toFixed(0)}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: 14 }}>₹ {currVal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isUp ? '#22c55e' : '#ef4444' }}>
                        {isUp ? '+' : ''}₹ {pnl.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>
                  <div style={{ height: 4, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, Math.abs(pnlPercent))}%`, background: isUp ? '#22c55e' : '#ef4444', borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {portfolioEntries.length === 0 && (
          <div style={{ margin: '16px 20px 0', padding: 24, background: 'white', border: '1.5px dashed #d1d5db', borderRadius: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📈</div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#374151', marginBottom: 4 }}>No investments yet</div>
            <div style={{ fontSize: 12, color: '#9ca3af' }}>Buy stocks to see your portfolio here</div>
          </div>
        )}

      </div>

      <BottomNav active="profile" />
    </div>
  );
};

export default Profile;
