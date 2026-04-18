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
            background: 'linear-gradient(135deg, #FF6B6B 0%, #EE5253 100%)',
            borderRadius: '20px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 16px rgba(238, 82, 83, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative'
          }}>
            {/* Background Decorative Element */}
            <div style={{
              position: 'absolute',
              top: -10,
              right: -10,
              width: 60,
              height: 60,
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              zIndex: 0
            }} />

            <div style={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              zIndex: 1
            }}>
              <Clock size={20} color="white" strokeWidth={2.5} />
            </div>

            <div style={{ zIndex: 1, flex: 1 }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '800', 
                color: 'white', 
                letterSpacing: '-0.3px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                MARKET CLOSED
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 6, height: 6, background: '#FFC048', borderRadius: '50%' }}
                />
              </div>
              <div style={{ 
                fontSize: '11px', 
                color: 'rgba(255, 255, 255, 0.85)', 
                fontWeight: '600',
                marginTop: '2px',
                lineHeight: '1.3'
              }}>
                {marketStatus.message || 'Trading is currently disabled. Please check back later.'}
              </div>
            </div>

            <div style={{
              padding: '6px 12px',
              borderRadius: '10px',
              background: 'rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '10px',
              fontWeight: '900',
              color: 'white',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Syncing
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MarketBanner;
