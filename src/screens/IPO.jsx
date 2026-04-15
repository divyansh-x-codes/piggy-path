import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { IPO_DATA } from '../data/mockData';
import { BottomNav } from '../components/Shared';

const IPO = () => {
  const navigate = useNavigate();
  const { ipoOrders, applyIPO } = useAppContext();
  const [tab, setTab] = useState('list');
  const [activeIpoTab, setActiveIpoTab] = useState(0);

  const ipoTabs = [
    `Current (${IPO_DATA.current.length})`,
    `Recently Closed (${IPO_DATA.closed.length})`,
    `Listed (${IPO_DATA.listed.length})`
  ];

  const handleApply = (ipo) => {
    applyIPO(ipo);
    alert('IPO Applied Successfully! Check "Your Orders" tab.');
    setTab('orders');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>

      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 20px', position: 'relative' }}>
        <div onClick={() => {
          if (window.history.length > 1) {
            navigate(-1);
          } else {
            navigate('/home');
          }
        }} style={{ position: 'absolute', left: 20, width: 44, height: 44, borderRadius: '50%', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
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

      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {tab === 'list' ? (
          activeIpoTab === 0 ? (
            /* Current IPOs */
            IPO_DATA.current.map((ipo, idx) => {
              const isApplied = ipoOrders.some(o => o.name === ipo.name);
              return (
                <div key={idx} style={{ margin: '16px 20px 24px', border: '1px solid black', borderRadius: 24, position: 'relative', padding: '30px 16px 16px', background: 'white' }}>
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1.5px solid black', borderRadius: 50, padding: '4px 16px', fontSize: 11, fontWeight: 700, zIndex: 10, color: 'black', whiteSpace: 'nowrap' }}>
                    closes in 3 days
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 40, height: 40, background: 'var(--purple-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: 'var(--purple)' }}>M</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{ipo.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{ipo.date}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 16, fontSize: 13, marginBottom: 12 }}>
                    <div><div style={{ color: 'var(--muted)', fontSize: 11 }}>Price Range</div><div style={{ fontWeight: 600 }}>{ipo.priceRange}</div></div>
                    <div><div style={{ color: 'var(--muted)', fontSize: 11 }}>Min Investment</div><div style={{ fontWeight: 600 }}>{ipo.minInv}</div></div>
                    <div><div style={{ color: 'var(--muted)', fontSize: 11 }}>Min Qty</div><div style={{ fontWeight: 600 }}>{ipo.minQty}</div></div>
                  </div>

                  {isApplied ? (
                    <button className="btn btn-outline" style={{ background: '#f0f0f0' }}>Applied ✓</button>
                  ) : (
                    <button className="btn btn-green" onClick={() => handleApply(ipo)}>Apply Now</button>
                  )}
                </div>
              );
            })
          ) : activeIpoTab === 1 ? (
            /* Recently Closed IPOs */
            IPO_DATA.closed.map((ipo, idx) => (
              <div key={idx} style={{ margin: '16px 20px 24px', border: '1px solid black', borderRadius: 24, position: 'relative', padding: '30px 16px 16px', background: 'white' }}>
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'white', border: '1.5px solid black', borderRadius: 50, padding: '4px 16px', fontSize: 11, fontWeight: 700, zIndex: 10, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                  closed
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, background: 'var(--purple-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: 'var(--purple)' }}>{ipo.name[0]}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{ipo.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{ipo.date}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 16, fontSize: 13, marginBottom: 12 }}>
                  <div><div style={{ color: 'var(--muted)', fontSize: 11 }}>Issue Price</div><div style={{ fontWeight: 600 }}>{ipo.issuePrice}</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: 11 }}>Listing Price</div><div style={{ fontWeight: 600 }}>{ipo.listPrice}</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: 11 }}>Listing Gain</div><div style={{ fontWeight: 600, color: 'var(--green)' }}>+{ipo.gain}%</div></div>
                </div>

                <button className="btn btn-green">Trade Now</button>
              </div>
            ))
          ) : (
            /* Listed IPOs */
            IPO_DATA.listed.map((ipo, idx) => (
              <div key={idx} className="card" style={{ margin: '0 20px 10px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, background: 'var(--green-light)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: 'var(--green)' }}>{ipo.name[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{ipo.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Listed</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>₹ {ipo.listPrice}</div>
                  <div style={{ fontSize: 12, color: 'var(--green)' }}>+{ipo.gain} gain</div>
                </div>
              </div>
            ))
          )
        ) : (
          /* Your Orders tab */
          ipoOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>No IPO orders yet.<br />Apply to IPOs to see them here.</div>
          ) : (
            ipoOrders.map((o, idx) => (
              <div key={idx} className="ipo-card" style={{ margin: '16px 20px' }}>
                <div className="badge-chip">closes in 3 days</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{o.name}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: 13, marginBottom: 12 }}>
                  <div><div style={{ color: 'var(--muted)', fontSize: 11 }}>Price Range</div><div style={{ fontWeight: 600 }}>111-117</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: 11 }}>Min Investment</div><div style={{ fontWeight: 600 }}>1,40,400</div></div>
                  <div><div style={{ color: 'var(--muted)', fontSize: 11 }}>Min Qty</div><div style={{ fontWeight: 600 }}>1200</div></div>
                </div>
                <button className="btn btn-outline" style={{ background: '#f0f0f0' }}>Waiting for Results</button>
              </div>
            ))
          )
        )}
      </div>

      <BottomNav active="ipo" />
    </div>
  );
};

export default IPO;
