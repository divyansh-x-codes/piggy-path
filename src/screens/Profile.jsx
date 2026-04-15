import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BottomNav } from '../components/Shared';
import { STOCKS } from '../data/mockData';

const Profile = () => {
  const navigate = useNavigate();
  const { userData, portfolio, tradeHistory, getPrice, user } = useAppContext();

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


              {/* Social icons */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </div>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#5865F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>
                </div>
              </div>

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
                        {(stock.logo || stock.name.substring(0,2)).toString().substring(0, 2)}
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
