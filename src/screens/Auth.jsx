import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { auth, provider, db } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const INPUT_STYLE = {
  width: '100%',
  border: '1px solid #d1d5db',
  borderRadius: 50,
  padding: '13px 18px',
  fontSize: 15,
  outline: 'none',
  background: 'white',
  fontFamily: "'DM Sans', sans-serif",
  boxSizing: 'border-box',
};

const Auth = () => {
  const [tab, setTab] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [radio, setRadio] = useState('sms');
  const [isSignup, setIsSignup] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [checked, setChecked] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { goScreen } = useAppContext();

  const handleLoginSuccess = async (user) => {
    // 1. Sync user data with Firestore
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: user.displayName || 'Investor',
        email: user.email,
        photo: user.photoURL,
        balance: 100000,
        createdAt: Date.now()
      });
    }

    // 2. Navigation is handled by AppContext's auth listener usually, 
    // but we can trigger it here for faster UI feedback
    goScreen('home', false);
  };

  const onEmailAuth = () => {
    setError('Email/Password login is temporarily disabled. Please use Google Login for real-time market access.');
  };

  const onPhoneLogin = () => {
    setError('Phone login is temporarily disabled. Please use Google Login for real-time market access.');
  };

  const onSocialLogin = async (providerType) => {
    if (providerType !== 'google') {
      setError('Only Google Login is supported for real-time session testing.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      await handleLoginSuccess(result.user);
    } catch (err) {
      console.error('Social login failed:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', background: '#FAFAFA', overflowY: 'auto' }}>

      <h1 style={{ fontFamily: "'Lora', serif", fontWeight: 700, fontSize: 26, textAlign: 'center', marginBottom: 20, color: 'black' }}>
        Enter phone or email
      </h1>

      {/* Email / Phone Tab Toggle */}
      <div style={{ display: 'flex', position: 'relative', marginBottom: 24, padding: '0 4px' }}>
        {tab === 'email' ? (
          <>
            <div style={{ flex: 1, background: '#6D28D9', color: 'white', textAlign: 'center', padding: '12px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, cursor: 'pointer', zIndex: 2, boxShadow: '0 4px 12px rgba(109,40,217,0.3)' }}>Email</div>
            <div onClick={() => { setTab('phone'); setError(''); }} style={{ flex: 1, background: 'white', color: 'black', textAlign: 'center', padding: '12px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, cursor: 'pointer', zIndex: 1, border: '1px solid black', marginLeft: -30, paddingLeft: 30 }}>Phone</div>
          </>
        ) : (
          <>
            <div onClick={() => { setTab('email'); setError(''); }} style={{ flex: 1, background: 'white', color: 'black', textAlign: 'center', padding: '12px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, cursor: 'pointer', zIndex: 1, border: '1px solid black', marginRight: -30, paddingRight: 30 }}>Email</div>
            <div style={{ flex: 1, background: '#6D28D9', color: 'white', textAlign: 'center', padding: '12px 0', borderRadius: 50, fontWeight: 700, fontSize: 15, cursor: 'pointer', zIndex: 2, boxShadow: '0 4px 12px rgba(109,40,217,0.3)' }}>Phone</div>
          </>
        )}
      </div>

      {/* ── EMAIL TAB ── */}
      {tab === 'email' ? (
        <>
          {/* Login / Create Account sub-toggle */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            <button onClick={() => { setIsSignup(false); setError(''); }} style={{ flex: 1, padding: '10px', borderRadius: 50, border: !isSignup ? '2px solid #6D28D9' : '1px solid #d1d5db', background: !isSignup ? '#f5f3ff' : 'white', color: !isSignup ? '#6D28D9' : '#6b7280', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Login
            </button>
            <button onClick={() => { setIsSignup(true); setError(''); }} style={{ flex: 1, padding: '10px', borderRadius: 50, border: isSignup ? '2px solid #6D28D9' : '1px solid #d1d5db', background: isSignup ? '#f5f3ff' : 'white', color: isSignup ? '#6D28D9' : '#6b7280', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              Create Account
            </button>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block', paddingLeft: 4 }}>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" style={INPUT_STYLE} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block', paddingLeft: 4 }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" style={INPUT_STYLE} />
          </div>
        </>
      ) : (
        /* ── PHONE TAB ── */
        <div style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block', paddingLeft: 4 }}>Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" style={INPUT_STYLE} />
        </div>
      )}

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 14, fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Social Login ── */}
      <div style={{ marginTop: 'auto', paddingTop: 16, paddingBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
          <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>{loading ? 'Logging you in...' : 'secure signup via google'}</span>
          <div style={{ flex: 1, height: 1, background: '#e5e7eb' }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          <button 
            disabled={loading}
            onClick={() => onSocialLogin('google')} 
            style={{ 
              width: '100%', 
              height: 60, 
              borderRadius: 30, 
              border: '2.5px solid black', 
              background: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              boxShadow: '0 4px 0px rgba(0,0,0,1)',
              gap: 12,
              fontWeight: 800,
              fontSize: 16,
              textTransform: 'uppercase'
            }}
          >
            <svg width="24" height="24" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.999,35.205,44,30,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
