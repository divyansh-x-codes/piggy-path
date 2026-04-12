import React from 'react';

const Splash = () => {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
      <h1 style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: 800, fontSize: 46, letterSpacing: '-1.5px', color: '#111', margin: 0, whiteSpace: 'nowrap' }}>
        P<span style={{ position: 'relative' }}>
          i
          <span style={{ position: 'absolute', top: '0.18em', left: '50%', transform: 'translateX(-50%)', width: '0.3em', height: '0.3em', background: '#00FFA3', borderRadius: '50%' }}></span>
        </span>ggyPath<span style={{ color: '#6D28D9' }}>.</span>
      </h1>
      <p style={{ fontFamily: "'Lora', serif", color: 'var(--muted)', marginTop: 12, fontSize: 16, fontWeight: 500, letterSpacing: '0.5px' }}>Learn. Invest. Grow.</p>
    </div>
  );
};

export default Splash;
