import React from 'react';
import classNames from 'classnames';
import { useAppContext } from '../context/AppContext';

export const BottomNav = ({ active }) => {
  const { goScreen } = useAppContext();
  
  const BoxProps = (isActive) => ({
    style: {
      width: 44,
      height: 44,
      border: '2px solid black',
      borderRadius: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isActive ? 'black' : 'white',
      boxShadow: isActive ? '2px 2px 0px #6D28D9' : 'none',
      transition: 'all 0.1s ease',
    }
  });

  const IconColor = (isActive) => isActive ? "white" : "black";

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 78, paddingBottom: 'env(safe-area-inset-bottom)', background: 'white', borderTop: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', zIndex: 1000 }}>
      
      <div onClick={() => goScreen('stocks')} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 6 }}>
        <div {...BoxProps(active === 'stocks')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={IconColor(active === 'stocks')} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
        </div>
        <span style={{ fontSize: 10, letterSpacing: '0.2px', fontWeight: 800, color: 'black' }}>Market</span>
      </div>

      <div onClick={() => goScreen('ipo')} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 6 }}>
        <div {...BoxProps(active === 'ipo')}>
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={IconColor(active === 'ipo')} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
        </div>
        <span style={{ fontSize: 10, letterSpacing: '0.2px', fontWeight: 800, color: 'black' }}>IPO</span>
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div onClick={() => goScreen('home')} style={{ width: 50, height: 50, borderRadius: '50%', background: '#4ade80', border: '2px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '3px 3px 0px #6D28D9', transform: 'translateY(-10px)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="black" stroke="black" strokeWidth="1" strokeLinejoin="round"><path d="M12 3L20 9V21H4V9L12 3Z"/></svg>
        </div>
      </div>

      <div onClick={() => goScreen('news')} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 6 }}>
        <div {...BoxProps(active === 'news')}>
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={IconColor(active === 'news')} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <span style={{ fontSize: 10, letterSpacing: '0.2px', fontWeight: 800, color: 'black' }}>News</span>
      </div>

      <div onClick={() => goScreen('profile')} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: 6 }}>
        <div {...BoxProps(active === 'profile')}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={IconColor(active === 'profile')} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </div>
        <span style={{ fontSize: 10, letterSpacing: '0.2px', fontWeight: 800, color: 'black' }}>Profile</span>
      </div>

    </div>
  );
};

export const Topbar = ({ title, rightIcon = '🔔', onRightClick, showSearch = false, searchPlaceholder }) => {
  const { goBack } = useAppContext();

  return (
    <div className="topbar">
      <div className="circle-btn" onClick={goBack}>←</div>
      {showSearch ? (
        <div style={{ flex: 1, background: '#f5f5f7', borderRadius: 50, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>🔍</span>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>{searchPlaceholder}</span>
        </div>
      ) : (
        <span className="topbar-title">{title}</span>
      )}
      {rightIcon ? (
        <div className="circle-btn" onClick={onRightClick}>{rightIcon}</div>
      ) : (
        <div style={{ width: 38 }} />
      )}
    </div>
  );
};
