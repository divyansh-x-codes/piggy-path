import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const MarketBanner = () => {
  const { marketStatus, isMarketOpen } = useAppContext();

  return (
    <AnimatePresence>
      {!isMarketOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{
            margin: '16px 16px 0',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', // Hard midnight dark
            borderRadius: '24px',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.2)',
            border: '2px solid black',
            position: 'relative'
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.15)', // Subtle red glow
              border: '1.5px solid #EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertCircle size={24} color="#EF4444" strokeWidth={2.5} />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '15px', 
                fontWeight: '900', 
                color: 'white', 
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textTransform: 'uppercase'
              }}>
                Market Halted
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: 8, height: 8, background: '#EF4444', borderRadius: '50%', boxShadow: '0 0 10px #EF4444' }}
                />
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#94a3b8', 
                fontWeight: '600',
                marginTop: '4px',
                lineHeight: '1.4'
              }}>
                {marketStatus.message || 'Trading is strictly disabled globally. Please wait for an admin to resume the session.'}
              </div>
            </div>

            <div style={{
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '10px', fontWeight: '900', color: '#EF4444', letterSpacing: '1px' }}>STATUS</div>
              <div style={{ fontSize: '12px', fontWeight: '900', color: 'white', marginTop: '2px' }}>OFF</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MarketBanner;
