import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { STOCKS } from '../data/mockData';

const IPO = () => {
  const { ipoOrders, applyIPO, goBack } = useAppContext();
  const [tab, setTab] = useState('list');
  const [activeIpoTab, setActiveIpoTab] = useState(0);

  // Generate 3 static mock IPO blocks for demonstration
  const dummyIpoList = Array(3).fill({
    name: 'Megasoft - pan hr solution limited',
    priceRange: '111-117',
    minInv: '1,40,400',
    minQty: '1200'
  });

  const ipoTabs = [
    `Current (1)`,
    `Recently Closed (3)`,
    `Listed (4)`
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px', position: 'relative' }}>
        <div onClick={goBack} style={{ position: 'absolute', left: 20, width: 44, height: 44, borderRadius: '50%', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, color: 'black' }}>IPO</div>
      </div>

      {/* Primary Tab Controls */}
      <div style={{ margin: '16px 20px', display: 'flex', border: '1px solid black', borderRadius: 50, overflow: 'hidden' }}>
        <div onClick={() => setTab('list')} style={{ flex: 1, padding: '12px 0', textAlign: 'center', background: tab === 'list' ? '#623cea' : 'white', color: tab === 'list' ? 'white' : 'black', fontWeight: 800, fontSize: 16, cursor: 'pointer', borderRight: '1px solid black' }}>
          IPO List
        </div>
        <div onClick={() => setTab('orders')} style={{ flex: 1, padding: '12px 0', textAlign: 'center', background: tab === 'orders' ? '#623cea' : 'white', color: tab === 'orders' ? 'white' : 'black', fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
          Your Orders
        </div>
      </div>

      {tab === 'list' && (
        <div style={{ display: 'flex', gap: 8, margin: '0 20px 24px', overflowX: 'auto', paddingBottom: 4 }}>
          {ipoTabs.map((t, i) => (
            <div 
              key={i} 
              onClick={() => setActiveIpoTab(i)} 
              style={{ padding: '8px 16px', borderRadius: 50, border: '1px solid black', fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap', cursor: 'pointer', background: i === activeIpoTab ? '#623cea' : 'white', color: i === activeIpoTab ? 'white' : 'black' }}
            >
              {t}
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 60 }}>
        {tab === 'list' ? (
          activeIpoTab === 0 ? (
            dummyIpoList.map((ipo, idx) => {
              // Ensure we have a real stock ID for the matching engine
              const realStockId = STOCKS[idx % STOCKS.length].id;
              
              const isApplied = ipoOrders.some(order => order.stockId === realStockId);
              
              return (
                <div key={idx} style={{ margin: '16px 20px 24px', border: '1px solid black', borderRadius: 24, position: 'relative', padding: '30px 16px 16px', background: 'white' }}>
                  {/* ... same UI ... */}
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1.5px solid black', borderRadius: 50, padding: '4px 16px', fontSize: 11, fontWeight: 700, zIndex: 10, color: 'black', whiteSpace: 'nowrap' }}>
                    closes in 3 days
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2, marginBottom: 2 }}>{ipo.name}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'black' }}>Real-time listing</div>
                    </div>
                  </div>

                  <div style={{ height: 1, borderTop: '1px solid black', marginBottom: 12 }}></div>

                  {isApplied ? (
                     <button style={{ width: '100%', padding: '12px 0', borderRadius: 50, background: '#d1d5db', border: '1px solid black', color: 'black', fontWeight: 700, fontSize: 15, cursor: 'not-allowed' }}>Applied</button>
                  ) : (
                     <button onClick={() => applyIPO({ id: realStockId, ...ipo })} style={{ width: '100%', padding: '12px 0', borderRadius: 50, background: '#22c55e', border: '1px solid black', color: 'white', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Apply Now</button>
                  )}
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)', fontWeight: 500 }}>No IPOs currently found in this cluster.</div>
          )
        ) : (
          ipoOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'black', fontWeight: 500 }}>No active IPO orders found. Your applications will appear here.</div>
          ) : (
            ipoOrders.map((o, idx) => (
              <div key={idx} style={{ margin: '16px 20px 24px', border: '1px solid black', borderRadius: 24, position: 'relative', padding: '16px', background: 'white' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{o.stock?.name || 'IPO Stock'}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>Applied Amount: ₹{o.amount.toLocaleString()}</div>
                  <div style={{ marginTop: 8 }}>
                    <span style={{ padding: '4px 12px', borderRadius: 50, background: '#e0f2fe', color: '#0369a1', fontSize: 11, fontWeight: 700 }}>{o.status}</span>
                  </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};

export default IPO;
