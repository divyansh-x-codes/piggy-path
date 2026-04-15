import React from 'react';
import { useAppContext } from '../context/AppContext';
import { STOCKS } from '../data/mockData';

const Bucket = () => {
  const { getPrice, getChange, openStockDetail, goBack } = useAppContext();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '30px 20px 16px', zIndex: 10 }}>
        <div onClick={goBack} style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>

        <div style={{ flex: 1, height: 42, borderRadius: 24, border: '2px solid black', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, background: 'white' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Search your stock</span>
        </div>

        <div style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="black"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </div>
      </div>

      {/* Scrollable List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 16px 140px' }}>
        {STOCKS.map((s, i) => {
          const price = getPrice(s);
          const chg = getChange(s);
          const isUp = chg >= 0;
          return (
            <div key={s.id} style={{ background: 'var(--purple)', borderRadius: 16, padding: 14, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, border: i === 1 ? '2px solid var(--green)' : 'none' }}>
              <div style={{ width: 44, height: 44, background: 'white', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: s.color }}>{s.logo}</div>
              <div style={{ flex: 1, color: 'white' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                <div style={{ fontSize: 11, opacity: .7 }}>{s.ticker}</div>
                <div style={{ fontSize: 12, marginTop: 4, color: isUp ? '#86efac' : '#fca5a5' }}>{isUp ? '▲ +' : '▼ '}{Math.abs(chg).toFixed(2)}%</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  <div style={{ width: 16, height: 8, borderRadius: '50%', background: 'var(--green)' }}></div>
                  <div style={{ width: 16, height: 8, borderRadius: '50%', background: 'var(--green)' }}></div>
                  <div style={{ width: 16, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.3)' }}></div>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>+</span>
                </div>
              </div>
              <button className="btn btn-green" style={{ padding: '10px 16px', fontSize: 13, flexShrink: 0 }} onClick={() => openStockDetail(s.id)}>Invest Now</button>
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <div style={{ position: 'fixed', bottom: 80, right: 20, width: 52, height: 52, background: 'var(--text)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 24, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,.3)' }}>+</div>
    </div>
  );
};

export default Bucket;
