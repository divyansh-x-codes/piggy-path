import React from 'react';
import { useAppContext } from '../context/AppContext';
import { STOCKS } from '../data/mockData';

const Bucket = () => {
  const { getPrice, openStockDetail, goScreen } = useAppContext();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA' }}>
      
      {/* Scaled Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '30px 20px 16px', zIndex: 10 }}>
        {/* Back Button */}
        <div onClick={() => goScreen('home')} style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
        
        {/* Search Pill */}
        <div style={{ flex: 1, height: 42, borderRadius: 24, border: '2px solid black', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, background: 'white' }}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
           <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Search your stock</span>
        </div>

        {/* Bell Button */}
        <div style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="black"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </div>
      </div>
      
      {/* Scrollable Flow */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 140px' }}>
        {STOCKS.map((s, i) => {
          const price = getPrice(s);
          return (
            <div key={s.id} style={{ background: '#7c3aed', borderRadius: 28, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              
              {/* Profile White Ring */}
              <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.ticker === 'MSFT' || i % 2 === 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 30, height: 30 }}>
                    <div style={{ background: '#ef4444' }}></div>
                    <div style={{ background: '#22c55e' }}></div>
                    <div style={{ background: '#3b82f6' }}></div>
                    <div style={{ background: '#eab308' }}></div>
                  </div>
                ) : (
                  <div style={{ fontWeight: 800, fontSize: 24, color: '#7c3aed' }}>{s.logo}</div>
                )}
              </div>
              
              <div style={{ flex: 1, color: 'white', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  {/* Name Wrap Component */}
                  <div style={{ maxWidth: 85, whiteSpace: 'pre-wrap', fontWeight: 600, fontSize: 18, lineHeight: 1.15 }}>Megas oft</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="#3b82f6"><path d="M12 2L22 20H2L12 2Z"/></svg>
                    <span style={{ fontSize: 11, fontWeight: 800 }}>+2.5%</span>
                  </div>
                </div>
                
                <div style={{ fontSize: 11, opacity: 0.9 }}>microsoft.inc</div>
                
                {/* Tiny Stacked Avatars Layer */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                   <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#2dd4bf', zIndex: 4, position: 'relative' }}></div>
                   <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#eab308', marginLeft: -4, zIndex: 3, position: 'relative' }}></div>
                   <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#f472b6', marginLeft: -4, zIndex: 2, position: 'relative' }}></div>
                   <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'white', marginLeft: -4, zIndex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                   </div>
                </div>
              </div>

              {/* Invest Logic Core Button */}
              <button 
                onClick={() => openStockDetail(s.id)}
                style={{ background: '#22c55e', border: 'none', borderRadius: 24, padding: '14px 16px', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', flexShrink: 0 }}
              >
                Invest Now
              </button>
            </div>
          );
        })}
      </div>
      
      {/* Interaction Floating Button */}
      <div 
        onClick={() => goScreen('home')}
        style={{ position: 'fixed', bottom: 40, right: 24, width: 56, height: 56, borderRadius: '50%', background: 'white', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 20 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
      </div>
    </div>
  );
};

export default Bucket;
