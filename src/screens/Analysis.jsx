import React from 'react';
import { useAppContext } from '../context/AppContext';
import { KISANPAY_ANALYSIS } from '../data/mockData';

const Analysis = () => {
  const { goBack } = useAppContext();
  const d = KISANPAY_ANALYSIS;

  return (
    <div style={{ flex: 1, backgroundColor: '#0a0a0a', overflowY: 'auto', color: 'white', fontFamily: "'DM Sans', sans-serif", paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <button onClick={goBack} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div>
          <h1 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Deep Dive Analysis</h1>
          <p style={{ fontSize: 12, opacity: 0.6, margin: 0 }}>KisanPay Fintech Pvt. Ltd.</p>
        </div>
      </div>

      {/* Main Card */}
      <div style={{ margin: '0 16px 24px', background: 'linear-gradient(180deg, #121212 0%, #0a0a0a 100%)', borderRadius: 28, border: '1px solid rgba(255,255,255,0.08)', padding: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 50, height: 50, borderRadius: 14, background: '#004D40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800 }}>KSP</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'white' }}>KisanPay Fintech</div>
              <div style={{ fontSize: 11, background: 'rgba(255,255,255,0.1)', display: 'inline-block', padding: '2px 8px', borderRadius: 4, marginTop: 4, fontWeight: 700 }}>KSPAY</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800 }}>₹{d.price.toFixed(2)}</div>
            <div style={{ fontSize: 12, opacity: 0.6, fontWeight: 600 }}>IPO Price</div>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {d.tags.map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: '4px 10px', borderRadius: 50, background: tag.includes('Risk') ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)', color: tag.includes('Risk') ? '#f87171' : '#4ade80', border: tag.includes('Risk') ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)', fontWeight: 700 }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {d.metrics.map(m => (
            <div key={m.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 16, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>{m.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: m.warning ? '#ff9800' : 'white' }}>{m.value}</div>
              <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4 }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Analyst Rating */}
      <div style={{ padding: '0 20px', marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>Analyst Rating</h2>
        <div style={{ background: '#121212', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ color: '#22C55E', fontSize: 24, fontWeight: 900, letterSpacing: '2px' }}>{d.rating.status}</div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>Conviction: {d.rating.conviction} / 5</div>
          </div>
          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 10, opacity: 0.5 }}>BEAR</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>₹{d.rating.bear}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ fontSize: 10, opacity: 0.5 }}>BASE</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>₹{d.rating.base}</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ fontSize: 10, opacity: 0.5 }}>BULL</div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>₹{d.rating.bull}</div>
            </div>
          </div>
        </div>
      </div>

      {/* SWOT Analysis */}
      <div style={{ padding: '0 20px', marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>SWOT Analysis</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* Strengths */}
          <div style={{ background: 'rgba(34, 197, 94, 0.05)', border: '1px solid rgba(34, 197, 94, 0.1)', borderRadius: 20, padding: 16 }}>
            <div style={{ color: '#22C55E', fontWeight: 800, fontSize: 12, marginBottom: 10 }}>STRENGTHS</div>
            {d.swot.strengths.slice(0, 3).map((item, i) => (
              <div key={i} style={{ fontSize: 10, lineHeight: 1.4, marginBottom: 8, opacity: 0.8 }}>• {item}</div>
            ))}
          </div>
          {/* Weaknesses */}
          <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', borderRadius: 20, padding: 16 }}>
            <div style={{ color: '#ef4444', fontWeight: 800, fontSize: 12, marginBottom: 10 }}>WEAKNESSES</div>
            {d.swot.weaknesses.slice(0, 3).map((item, i) => (
              <div key={i} style={{ fontSize: 10, lineHeight: 1.4, marginBottom: 8, opacity: 0.8 }}>• {item}</div>
            ))}
          </div>
          {/* Opportunities */}
          <div style={{ background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.1)', borderRadius: 20, padding: 16 }}>
            <div style={{ color: '#3b82f6', fontWeight: 800, fontSize: 12, marginBottom: 10 }}>OPPORTUNITIES</div>
            {d.swot.opportunities.slice(0, 3).map((item, i) => (
              <div key={i} style={{ fontSize: 10, lineHeight: 1.4, marginBottom: 8, opacity: 0.8 }}>• {item}</div>
            ))}
          </div>
          {/* Threats */}
          <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.1)', borderRadius: 20, padding: 16 }}>
            <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: 12, marginBottom: 10 }}>THREATS</div>
            {d.swot.threats.slice(0, 3).map((item, i) => (
              <div key={i} style={{ fontSize: 10, lineHeight: 1.4, marginBottom: 8, opacity: 0.8 }}>• {item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Quant Score */}
      <div style={{ padding: '0 20px', marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>Quant Score</h2>
        <div style={{ background: '#121212', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', border: '6px solid #22C55E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{d.quantScore.total}</div>
            <div style={{ fontSize: 10, opacity: 0.6 }}>/100</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Grade: {d.quantScore.grade}</div>
            <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>Composite of 6 sub-scores</div>
          </div>
        </div>
      </div>

      {/* Projections Chart */}
      <div style={{ padding: '0 20px', marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>AUM & Revenue Projection</h2>
        <div style={{ background: '#121212', borderRadius: 24, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 160, gap: 12, marginBottom: 16 }}>
            {[
              { label: 'FY24', aum: 10, rev: 5 },
              { label: 'Yr 1', aum: 25, rev: 15 },
              { label: 'Yr 2', aum: 55, rev: 40 },
              { label: 'Yr 3', aum: 100, rev: 80 },
            ].map((bar, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', gap: 4, width: '100%', alignItems: 'flex-end', justifyContent: 'center' }}>
                    <div style={{ width: 12, background: 'linear-gradient(180deg, #22C55E 0%, #166534 100%)', height: `${bar.aum}%`, borderRadius: '4px 4px 0 0' }}></div>
                    <div style={{ width: 12, background: 'linear-gradient(180deg, #f59e0b 0%, #b45309 100%)', height: `${bar.rev}%`, borderRadius: '4px 4px 0 0' }}></div>
                </div>
                <div style={{ fontSize: 9, fontWeight: 800, opacity: 0.5, marginTop: 8 }}>{bar.label}</div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#22C55E' }}></div>
              <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7 }}>AUM</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: '#f59e0b' }}></div>
              <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.7 }}>REVENUE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Traction */}
      <div style={{ padding: '0 20px' }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>Traction</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {d.traction.map(t => (
            <div key={t.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#22C55E' }}>{t.value}</div>
              <div style={{ fontSize: 8, opacity: 0.5, marginTop: 4, fontWeight: 700, textTransform: 'uppercase' }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analysis;
