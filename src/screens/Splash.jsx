import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Splash = () => {
  const navigate = useNavigate();
  const { user, loading } = useAppContext();

  // Auto-navigate after splash animation (1.8s)
  useEffect(() => {
    if (loading) return; // Wait for initial auth check

    const timer = setTimeout(() => {
      if (user) {
        navigate('/home', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate, user, loading]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', fontFamily: "'Lora', serif", fontWeight: 800, fontSize: 62, letterSpacing: '1px', color: '#111' }}>
        P
        <span style={{ position: 'relative', display: 'inline-block' }}>
          i
          {/* Mask the original dot of the 'i' */}
          <span style={{ position: 'absolute', top: 0, left: '-10%', right: '-10%', height: '35%', background: '#FAFAFA', zIndex: 1 }}></span>
          {/* Create the neon green dot */}
          <span style={{ position: 'absolute', top: '0.1em', left: '50%', transform: 'translateX(-50%)', width: '0.24em', height: '0.24em', background: '#00FFA3', borderRadius: '50%', zIndex: 2 }}></span>
        </span>
        ggyPath
        <span style={{ color: '#6D28D9' }}>.</span>
      </div>
      <p style={{ fontFamily: "'Lora', serif", color: 'var(--muted)', marginTop: 12, fontSize: 16, fontWeight: 600, letterSpacing: '1px' }}>Learn. Invest. Grow.</p>
    </div>
  );
};

export default Splash;
