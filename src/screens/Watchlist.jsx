import React from 'react';
import { Topbar } from '../components/Shared';
import { useAppContext } from '../context/AppContext';
import { STOCKS } from '../data/mockData';

const Watchlist = () => {
  const { watchlist, setWatchlist, getPrice, getChange, openStockDetail } = useAppContext();

  const removeWatchlist = (e, id) => {
    e.stopPropagation();
    setWatchlist(watchlist.filter(x => x !== id));
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Topbar title="Watchlist" rightIcon="+" />
      
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, paddingBottom: 80 }}>
        {watchlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No stocks in watchlist. Add some!</div>
        ) : (
          watchlist.map(id => {
            const s = STOCKS.find(x => x.id === id);
            if (!s) return null;
            const price = getPrice(s);
            const chg = getChange(s);
            return (
              <div key={id} onClick={() => openStockDetail(s.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: s.color }}>{s.logo}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.ticker}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>₹ {price.toLocaleString()}</div>
                  <div className={`tag ${chg >= 0 ? 'tag-green' : 'tag-red'}`}>{chg >= 0 ? '▲ +' : '▼ '}{Math.abs(chg).toFixed(2)}%</div>
                </div>
                <button 
                  onClick={(e) => removeWatchlist(e, s.id)} 
                  style={{ background: 'var(--red-light)', color: 'var(--red)', border: 'none', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 12 }}
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Watchlist;
