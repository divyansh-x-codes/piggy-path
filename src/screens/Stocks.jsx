import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BottomNav, Topbar } from '../components/Shared';
import { STOCKS } from '../data/mockData';

const Stocks = () => {
  const { getPrice, openStockDetail } = useAppContext();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Topbar title="Markets" />
      
      <div style={{ padding: '12px 16px' }}>
        <div style={{ background: '#f5f5f7', borderRadius: 50, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ color: 'var(--muted)', fontSize: 16 }}>🔍</span>
          <span style={{ color: 'var(--muted)', fontSize: 14 }}>Search stocks...</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 80px' }}>
        {STOCKS.map(s => {
          const price = getPrice(s);
          return (
            <div key={s.id} onClick={() => openStockDetail(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: s.color }}>
                {s.logo}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.ticker} • {s.sector}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: 15 }}>₹ {price.toLocaleString()}</div>
                <div className={`tag ${s.change >= 0 ? 'tag-green' : 'tag-red'}`}>
                  {s.change >= 0 ? '▲ +' : '▼ '}{s.change}%
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav active="stocks" />
    </div>
  );
};

export default Stocks;
