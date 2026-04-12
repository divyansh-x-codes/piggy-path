import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BottomNav } from '../components/Shared';

const CATEGORIES = ["Trending News", "IT News", "Healthcare News"];

const News = () => {
  const { goScreen } = useAppContext();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#FAFAFA' }}>
      
      {/* Target Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '24px 20px 16px', zIndex: 10 }}>
        {/* Back Button */}
        <div onClick={() => goScreen('home')} style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </div>
        
        {/* Search Pill */}
        <div style={{ flex: 1, height: 42, borderRadius: 24, border: '2px solid black', display: 'flex', alignItems: 'center', padding: '0 16px', gap: 8, background: 'white' }}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
           <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Search your news</span>
        </div>

        {/* Bell Button */}
        <div style={{ width: 46, height: 46, borderRadius: '50%', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'white', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="black"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </div>
      </div>
      
      {/* Scrollable Content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 100 }}>
        {CATEGORIES.map((cat, idx) => (
          <div key={idx} style={{ padding: '0 20px', marginBottom: 24 }}>
            {/* Sec Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: 'black' }}>{cat}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'black', cursor: 'pointer' }}>View all</span>
            </div>
            
            {/* Mockup Card */}
            <div onClick={() => goScreen('article')} style={{ border: '2px solid black', borderRadius: 28, padding: '20px', background: 'white', cursor: 'pointer' }}>
              
              {/* Card Meta Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Purple Logo Box */}
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, width: 26, height: 26 }}>
                      <div style={{ background: '#ef4444' }}></div>
                      <div style={{ background: '#22c55e' }}></div>
                      <div style={{ background: '#3b82f6' }}></div>
                      <div style={{ background: '#eab308' }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: 'black', lineHeight: 1.1 }}>Megasoft</div>
                    <div style={{ fontSize: 13, color: 'black', marginTop: 4 }}>microsoft.inc</div>
                  </div>
                </div>
                {/* Stats */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#0ea5e9"><path d="M12 2L22 20H2L12 2Z"/></svg>
                  <span style={{ fontSize: 13, fontWeight: 800, color: 'black' }}>+2.5%</span>
                </div>
              </div>

              {/* Flex Content Layer */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  {/* Headline */}
                  <div style={{ display: 'inline-block', position: 'relative', marginBottom: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 900, color: 'black', position: 'relative', zIndex: 1, letterSpacing: '-0.3px', lineHeight: 1.25 }}>Why We Have To Sell Microsoft</span>
                    <div style={{ position: 'absolute', bottom: 4, left: 0, right: 0, height: 5, background: '#0ea5e9', zIndex: 0 }}></div>
                  </div>
                  {/* Body Text */}
                  <div style={{ fontSize: 12, lineHeight: 1.4, color: '#4b5563', letterSpacing: '-0.1px' }}>
                    {cat === "IT News" 
                      ? "Industry analysts are heavily weighing the long-term impact of restructuring enterprise cloud divisions to optimize overhead and drive renewed Q4 consumer growth metrics."
                      : cat === "Healthcare News" 
                      ? "Recent sector regulations point towards massive market consolidation. Investors predict a strong rally as new breakthrough patents await critical FDA approvals." 
                      : "Following recent board adjustments, institutional investors are reassessing their multi-year portfolios in light of shifting macroeconomic trends and unexpected buyout rumors."}
                  </div>
                </div>
                
                {/* Visual Block Data */}
                <div style={{ width: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  {/* Grey Blank Photo */}
                  <div style={{ width: 90, height: 100, background: '#d1d5db', borderRadius: 8 }}></div>
                  {/* Engage Stats */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '90%', marginTop: 12 }}>
                    <div style={{ textAlign: 'center' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg><div style={{ fontSize: 9, fontWeight: 800 }}>1.3k</div></div>
                    <div style={{ textAlign: 'center' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="#3b82f6"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg><div style={{ fontSize: 9, fontWeight: 800 }}>1.3k</div></div>
                    <div style={{ textAlign: 'center' }}><svg width="13" height="13" viewBox="0 0 24 24" fill="black"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg><div style={{ fontSize: 9, fontWeight: 800 }}>1.3k</div></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      <BottomNav active="news" />
    </div>
  );
};

export default News;
