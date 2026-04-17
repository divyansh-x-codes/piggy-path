import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { auth, provider } from '../lib/firebase';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin } = useAppContext();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  // 1. WATCH GLOBAL USER STATE: Redirect if already logged in or login completes
  useEffect(() => {
    if (!authLoading && user) {
      console.log("Auth: User detected, redirecting to", isAdmin ? '/admin' : '/home');
      if (isAdmin) navigate('/admin', { replace: true });
      else navigate('/home', { replace: true });
    }
  }, [user, authLoading, isAdmin, navigate]);

  // 2. HANDLE REDIRECT RESULT: Catch errors or success from Firebase redirect
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          // Success! Context listener in AppContext will pick up the user 
          // and trigger the useEffect above for navigation.
          setLocalLoading(true); // Show processing state while context catches up
        }
      } catch (err) {
        console.error('Redirect login error:', err);
        if (err.code !== 'auth/operation-not-supported-in-this-environment') {
          setError('Login failed: ' + err.message);
        }
      }
    };
    handleRedirect();
  }, []);

  const onContinue = () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Simulation for "Wrong password" as seen in image
    if (password !== 'admin123') {
      setError('Wrong password');
    } else {
      setError('Email/Password login is temporarily disabled. Please use Google Login.');
    }
  };

  const onSocialLogin = async (type) => {
    if (type === 'apple') {
      setError('Apple login is coming soon.');
      return;
    }
    setLocalLoading(true);
    setError('');
    try {
      // signInWithRedirect for mobile browser compatibility
      await signInWithRedirect(auth, provider);
    } catch (err) {
      setError(err.message || 'Login failed');
      setLocalLoading(false);
    }
  };

  const isLoading = authLoading || localLoading;

  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      background: 'white', 
      padding: '40px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* ── Tabs ── */}
      <div style={{ display: 'flex', marginBottom: 40, borderBottom: '1px solid #E5E7EB', position: 'relative' }}>
        <div 
          onClick={() => setActiveTab('login')}
          style={{ 
            flex: 1, 
            textAlign: 'center', 
            paddingBottom: 12, 
            fontSize: 20, 
            fontWeight: 600, 
            color: activeTab === 'login' ? 'black' : '#9CA3AF',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative'
          }}
        >
          Log in
          {activeTab === 'login' && (
            <div style={{ position: 'absolute', bottom: -1, left: '20%', width: '60%', height: 3, background: 'black', borderRadius: '4px 4px 0 0' }} />
          )}
        </div>
        <div 
          onClick={() => setActiveTab('signup')}
          style={{ 
            flex: 1, 
            textAlign: 'center', 
            paddingBottom: 12, 
            fontSize: 20, 
            fontWeight: 600, 
            color: activeTab === 'signup' ? 'black' : '#9CA3AF',
            cursor: 'pointer',
            transition: 'all 0.2s',
            position: 'relative'
          }}
        >
          Sign up
          {activeTab === 'signup' && (
            <div style={{ position: 'absolute', bottom: -1, left: '20%', width: '60%', height: 3, background: '#D1D5DB', borderRadius: '4px 4px 0 0' }} />
          )}
        </div>
      </div>

      {/* ── Form ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Your Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alphainvent@gmail.com"
            style={{ 
              width: '100%', 
              height: 54, 
              border: '1px solid #E5E7EB', 
              borderRadius: 12, 
              padding: '0 16px', 
              fontSize: 15,
              outline: 'none',
              color: '#1F2937'
            }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Password</label>
          <div style={{ position: 'relative' }}>
            <input 
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••••••"
              style={{ 
                width: '100%', 
                height: 54, 
                border: `1.5px solid ${error === 'Wrong password' ? '#F87171' : '#E5E7EB'}`, 
                borderRadius: 12, 
                padding: '0 45px 0 16px', 
                fontSize: 15,
                outline: 'none',
                color: '#1F2937'
              }} 
            />
            <div 
              onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#9CA3AF' }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                {!showPass && <path d="M3 3l18 18" strokeLinecap="round" />}
              </svg>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span style={{ fontSize: 12, color: '#F87171', visibility: error === 'Wrong password' ? 'visible' : 'hidden' }}>Wrong password</span>
            <span style={{ fontSize: 13, color: '#4F46E5', fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
          </div>
        </div>

        <button 
          onClick={onContinue}
          style={{ 
            marginTop: 4, 
            height: 54, 
            background: '#4F46E5', 
            color: 'white', 
            border: 'none', 
            borderRadius: 12, 
            fontSize: 16, 
            fontWeight: 700, 
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
          }}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </div>

      {error && error !== 'Wrong password' && (
        <div style={{ marginTop: 12, color: '#EF4444', fontSize: 12, textAlign: 'center' }}>{error}</div>
      )}

      {/* ── Or Divider ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '32px 0' }}>
        <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
        <span style={{ fontSize: 14, color: '#9CA3AF' }}>Or</span>
        <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
      </div>

      {/* ── Social Logins ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button 
          onClick={() => onSocialLogin('apple')}
          style={{ 
            height: 52, 
            background: 'white', 
            border: '1px solid #E5E7EB', 
            borderRadius: 12, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'not-allowed'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.673-1.48 3.674-2.936 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2.015-.156-3.935 1.09-4.96 1.09zM15.86 3.013c.896-1.078 1.507-2.585 1.338-4.013-1.286.052-2.844.857-3.766 1.935-.831.948-1.558 2.494-1.364 3.896 1.429.104 2.896-.74 3.792-1.818z" />
          </svg>
          Login with Apple
        </button>

        <button 
          onClick={() => onSocialLogin('google')}
          style={{ 
            height: 52, 
            background: 'white', 
            border: '1px solid #E5E7EB', 
            borderRadius: 12, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {isLoading ? 'Connecting...' : 'Login with Google'}
        </button>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: '#9CA3AF' }}>
        Don't have an account? <span 
          onClick={() => setActiveTab('signup')}
          style={{ color: '#4F46E5', fontWeight: 600, cursor: 'pointer' }}
        >
          Sign up
        </span>
      </div>

      <div 
        onClick={() => onSocialLogin('google')}
        style={{ marginTop: 'auto', textAlign: 'center', fontSize: 11, color: '#F3F4F6', cursor: 'pointer' }}
      >
        Administrator Login
      </div>

    </div>
  );
};

export default Auth;
