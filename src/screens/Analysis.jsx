import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RESEARCH_REPORTS } from '../data/mockData';

const Analysis = () => {
  const { stockId } = useParams();
  const navigate = useNavigate();
  const d = RESEARCH_REPORTS[stockId];

  if (!d) return <div style={{ padding: 40, textAlign: 'center' }}>Report data unavailable.</div>;

  const goBack = () => navigate(-1);

  return (
    <div style={{ flex: 1, height: '100%', background: 'white', overflowY: 'auto', padding: '24px 20px 60px' }}>
      
      {/* Finanza Strip Banner */}
      <div style={{ background: '#f0fdf4', border: '0.5px solid #bcf0da', borderRadius: 8, padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#166534', lineHeight: 1.4 }}>
        <span style={{ fontSize: 18, fontWeight: 800 }}>✓</span>
        <span>
          <strong style={{ fontWeight: 700 }}>Finanza Verified</strong> — Audited and approved by the Finance & Investment Club, Rishihood University. DRHP ID: TL-2025-019 | Approved: 16 April 2025 | Institutional Grade Filing
        </span>
      </div>

      {/* Header Bar */}
      <div style={{ background: '#f8fafc', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: '20px 24px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div onClick={goBack} style={{ width: 44, height: 44, borderRadius: '50%', border: '0.5px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', marginRight: 4 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a3a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </div>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#1a1a3a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, color: '#fff', letterSpacing: 1, flexShrink: 0 }}>
              {RESEARCH_REPORTS[stockId].logo || 'N/A'}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20, fontWeight: 500, color: '#0f172a', fontFamily: 'Georgia, serif' }}>{RESEARCH_REPORTS[stockId].name || stockId.toUpperCase()}</span>
                <span style={{ background: '#1a1a3a', color: '#a5b4fc', fontSize: 11, padding: '3px 8px', borderRadius: 4, letterSpacing: 1 }}>{RESEARCH_REPORTS[stockId].ticker || stockId.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>
                {RESEARCH_REPORTS[stockId].sector} &nbsp;·&nbsp; Institutional Grade Due Diligence &nbsp;·&nbsp; April 2025
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 32, fontWeight: 500, color: '#0f172a', fontFamily: 'Georgia, serif' }}>₹{RESEARCH_REPORTS[stockId].price || '0.00'}</div>
            <div style={{ fontSize: 13, marginTop: 2, color: '#64748b' }}>IPO Price | Mkt Cap: {RESEARCH_REPORTS[stockId].mktCap}</div>
          </div>
        </div>
        
        {/* Tags */}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 14 }}>
          {(RESEARCH_REPORTS[stockId].tags || []).map((tag, i) => (
            <span key={i} style={{ 
              fontSize: 10, padding: '4px 12px', borderRadius: 20, border: '0.5px solid',
              background: i === 0 ? '#fffbeb' : '#f1f5f9',
              color: i === 0 ? '#92400e' : '#475569',
              borderColor: i === 0 ? '#fef3c7' : '#e2e8f0'
            }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Core Metrics Grid (4x2) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 12 }}>
        {d.metrics.map((m, i) => (
          <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 16px', border: '0.5px solid #e2e8f0' }}>
            <div style={{ fontSize: 10, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color: (m.value.includes('Cr') || m.value.includes('%') || m.value.includes('Zero')) ? '#15803d' : '#0f172a', fontFamily: 'Georgia, serif' }}>{m.value}</div>
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        {/* Analyst Rating Card */}
        <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: '20px' }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 }}>Analyst Rating</div>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 22, marginBottom: 6, letterSpacing: 2, color: '#b45309' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < Math.floor(d.rating.conviction) ? '★' : '☆'}</span>
              ))}
            </div>
            <div style={{ fontSize: 26, fontWeight: 500, family: 'Georgia, serif', color: d.rating.status === 'WATCH' ? '#b45309' : '#15803d' }}>{d.rating.status}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Conviction: {d.rating.conviction} / 5 · Finanza Consensus</div>
          </div>
          
          <div style={{ margin: '16px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#64748b', marginBottom: 6 }}>
              <span>Bear: ₹{d.rating.bear}</span>
              <span style={{ fontWeight: 500, color: '#0f172a' }}>Base: ₹{d.rating.base}</span>
              <span>Bull: ₹{d.rating.bull}</span>
            </div>
            <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #ef4444 0%, #eab308 45%, #22c55e 100%)', width: '100%' }}></div>
              <div style={{ position: 'absolute', width: 14, height: 14, borderRadius: '50%', background: 'white', border: '2px solid #1a1a3a', top: '50%', left: `${(d.price - d.rating.bear) / (d.rating.bull - d.rating.bear) * 100}%`, transform: 'translate(-50%, -50%)', zIndex: 10 }}></div>
            </div>
            <div style={{ fontSize: 13, marginTop: 10, fontWeight: 500, color: '#0f172a' }}>12-Month Price Target: <strong>{d.rating.targetRange}</strong></div>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px', marginTop: 12, fontSize: 12, color: '#64748b', lineHeight: 1.6, borderLeft: '3px solid #1a1a3a' }}>
            {d.rating.summary ? d.rating.summary.substring(0, 300) + '...' : "Due diligence indicates structural Moats. Recommend monitoring pilot traction volumes closely."}<br/><br/>
            <em>— Finanza Research Team, April 2025</em>
          </div>
        </div>

        {/* Quant Score Card (Sharp Styles) */}
        <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: '20px' }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 }}>Quant Score</div>
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontSize: 48, fontWeight: 500, color: '#b45309', lineHeight: 1, fontFamily: 'Georgia, serif' }}>{d.quantScore.total}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>out of 100 · Grade: <strong style={{ color: '#b45309' }}>{d.quantScore.grade}</strong></div>
            <div style={{ height: 8, borderRadius: 4, background: '#f1f5f9', margin: '12px 0 4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${d.quantScore.total}%`, borderRadius: 4, background: '#b45309' }}></div>
            </div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>Composite of 6 sub-scores</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginTop: 10 }}>
            {Object.entries(d.quantScore.subScores).map(([key, val]) => (
              <div key={key} style={{ fontSize: 11, color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ textTransform: 'capitalize' }}>{key}</span>
                <span style={{ fontWeight: 500, color: val > 75 ? '#15803d' : (val > 50 ? '#b45309' : '#dc2626') }}>{val}/100</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: 16, marginBottom: 8 }}>Risk Register</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(d.riskRegister || []).map((risk, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, padding: '5px 0', borderBottom: '0.5px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>{risk.name || risk.label}</span>
                <span style={{ 
                  fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 500,
                  background: risk.level === 'HIGH' ? '#fef2f2' : (risk.level === 'MEDIUM' ? '#fffbeb' : '#f0fdf4'),
                  color: risk.level === 'HIGH' ? '#ef4444' : (risk.level === 'MEDIUM' ? '#92400e' : '#166534')
                }}>{risk.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SWOT Analysis Card */}
      <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: '20px', marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 }}>SWOT Analysis</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div style={{ background: '#f0fdf4', borderRadius: 8, padding: '14px', border: '0.5px solid #bcf0da', color: '#14532d' }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1, marginBottom: 8, opacity: 0.8 }}>STRENGTHS</div>
            {d.swot.strengths?.map((s, i) => <div key={i} style={{ fontSize: 12, lineHeight: 1.5, padding: '3px 0', display: 'flex', gap: 6 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', marginTop: 7, flexShrink: 0 }}></span><span>{s}</span></div>)}
          </div>
          <div style={{ background: '#fef2f2', borderRadius: 8, padding: '14px', border: '0.5px solid #fecaca', color: '#7f1d1d' }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1, marginBottom: 8, opacity: 0.8 }}>WEAKNESSES</div>
            {d.swot.weaknesses?.map((w, i) => <div key={i} style={{ fontSize: 12, lineHeight: 1.5, padding: '3px 0', display: 'flex', gap: 6 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', marginTop: 7, flexShrink: 0 }}></span><span>{w}</span></div>)}
          </div>
          <div style={{ background: '#eff6ff', borderRadius: 8, padding: '14px', border: '0.5px solid #bfdbfe', color: '#1e3a8a' }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1, marginBottom: 8, opacity: 0.8 }}>OPPORTUNITIES</div>
            {d.swot.opportunities?.map((o, i) => <div key={i} style={{ fontSize: 12, lineHeight: 1.5, padding: '3px 0', display: 'flex', gap: 6 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', marginTop: 7, flexShrink: 0 }}></span><span>{o}</span></div>)}
          </div>
          <div style={{ background: '#fffbeb', borderRadius: 8, padding: '14px', border: '0.5px solid #fef3c7', color: '#78350f' }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: 1, marginBottom: 8, opacity: 0.8 }}>THREATS</div>
            {d.swot.threats?.map((t, i) => <div key={i} style={{ fontSize: 12, lineHeight: 1.5, padding: '3px 0', display: 'flex', gap: 6 }}><span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', marginTop: 7, flexShrink: 0 }}></span><span>{t}</span></div>)}
          </div>
        </div>
        
        {/* Unique Box */}
        <div style={{ background: '#f1f5f9', borderRadius: 8, padding: '14px 16px', marginTop: 12, borderLeft: '3px solid #1a1a3a' }}>
          <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#1a1a3a', marginBottom: 6 }}>{d.uniquenessTitle || "Strategic Uniqueness"}</div>
          <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>{d.uniquenessProposition}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Left: Financial Snapshot */}
        <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: '20px' }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 }}>Financial Snapshot</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {d.financialSnapshot.map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '6px 0', borderBottom: i === d.financialSnapshot.length - 1 ? 'none' : '0.5px solid #f1f5f9', fontSize: 13 }}>
                <span style={{ color: '#64748b' }}>{s.label}</span>
                <span style={{ fontWeight: 500, color: s.color || '#0f172a' }}>{s.value}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#fffbeb', border: '0.5px solid #fef3c7', borderRadius: 8, padding: '12px', marginTop: 10, fontSize: 12, color: '#92400e' }}>
            <strong>⚠ Pre-Revenue Alert:</strong> {d.alert?.text || "Institutional data remains under quarterly review. All projections are founder estimates and unaudited."}
          </div>
        </div>

        {/* Right: Revenue Projection */}
        <div style={{ background: 'white', border: '0.5px solid #e2e8f0', borderRadius: 12, padding: '20px' }}>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 14 }}>Revenue Projection (₹ Lakhs)</div>
          <div style={{ position: 'relative', height: 160, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: 8 }}>
             {d.graphImage ? (
                <img src={d.graphImage} alt="Revenue Projection" style={{ maxWidth: '100%', maxHeight: '100%' }} />
             ) : (
                <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>CHART DATA UNDER AUDIT</div>
             )}
          </div>
          <div style={{ fontSize: 10, fontWeight: 500, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.6px', marginTop: 16, marginBottom: 10 }}>Company Milestones</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {(d.milestones || []).slice(0, 6).map((m, i) => (
              <div key={i} style={{ background: '#f8fafc', borderRadius: 8, padding: '12px 8px', textAlignment: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: '#0f172a', fontFamily: 'Georgia, serif' }}>{m.value}</div>
                <div style={{ fontSize: 9, color: '#64748b', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.4px' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CAP STRUCTURE & DEAL TERMS */}
      {d.dealTerms && (
        <div style={{ padding: 32, background: '#1e293b', borderRadius: 24, color: 'white' }}>
          <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 24, letterSpacing: '0.8px' }}>CAP STRUCTURE & DEAL TERMS</div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[...(d.dealTerms.founders || []), ...(d.dealTerms.others || [])].map((item, idx) => (
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
               <div style={{ fontSize: 12, fontWeight: 700 }}>{d.dealTerms.instrument}</div>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12 }}>
               <div style={{ fontSize: 8, fontWeight: 800, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>MIN. TICKET</div>
               <div style={{ fontSize: 12, fontWeight: 700 }}>{d.dealTerms.minTicket}</div>
             </div>
             <div style={{ background: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12 }}>
               <div style={{ fontSize: 8, fontWeight: 800, color: '#64748b', marginBottom: 4, textTransform: 'uppercase' }}>IPO PRICE</div>
               <div style={{ fontSize: 12, fontWeight: 700 }}>{d.dealTerms.virtualIpoPrice}</div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;
