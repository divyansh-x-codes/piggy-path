import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CRITICAL CRASH]', error, errorInfo);
  }

  resetApp = () => {
    localStorage.clear();
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', background: '#0f172a', 
          color: 'white', padding: 24, textAlign: 'center', gap: 16 
        }}>
          <div style={{ fontSize: 64 }}>⚠️</div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>App Recovery Mode</h1>
          <p style={{ opacity: 0.8, fontSize: 14 }}>The app encountered a technical error.</p>
          
          <div style={{ 
            background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,255,255,0.1)', 
            padding: 12, borderRadius: 12, width: '100%', maxWidth: 300,
            fontSize: 12, color: '#fca5a5', overflowX: 'auto', textAlign: 'left'
          }}>
            <code style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.message}</code>
          </div>

          <button 
            onClick={this.resetApp}
            style={{ 
              background: '#7C3AED', color: 'white', border: 'none', 
              padding: '12px 24px', borderRadius: 50, fontWeight: 800, 
              cursor: 'pointer', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)'
            }}
          >
            Reset & Restart App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
