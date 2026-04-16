import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { BottomNav } from '../components/Shared';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { stocks, isAdmin } = useAppContext();

  // Internal state to track the "Visual" order for sequential movement
  const [displayedList, setDisplayedList] = useState([]);

  // 1. MASTER MONITOR LOGIC: CALCULATE TARGET RANKING
  const targetLeaderboard = useMemo(() => {
    const stockList = Object.entries(stocks || {}).map(([id, s]) => {
      const price = s.price || 0;
      const prev = s.prevPrice || price;
      const change = prev !== 0 ? ((price - prev) / prev) * 100 : 0;
      return {
        id,
        symbol: s.symbol,
        name: s.name,
        price,
        change,
        totalHoldings: s.totalHoldings || 0
      };
    });
    return [...stockList].sort((a, b) => b.change - a.change);
  }, [stocks]);

  // 2. INITIALIZE DISPLAYED LIST
  useEffect(() => {
    if (displayedList.length === 0 && targetLeaderboard.length > 0) {
      setDisplayedList(targetLeaderboard);
    }
  }, [targetLeaderboard]);

  // 3. SEQUENTIAL SYNC LOOP ("One-by-One" Logic)
  // This effect gradually moves items towards their target indices
  const syncTimer = useRef(null);
  useEffect(() => {
    if (!isAdmin || displayedList.length === 0) return;

    // Check if current order matches target order
    const isIdentical = displayedList.every((s, i) => s.id === targetLeaderboard[i]?.id);

    // 1. FRESH DATA SYNC (Always keep prices/stats updated in the current displayed order)
    const dataUpdatedList = displayedList.map(s => {
      const fresh = targetLeaderboard.find(t => t.id === s.id);
      return fresh ? { ...s, ...fresh } : s;
    });

    const dataChanged = JSON.stringify(displayedList) !== JSON.stringify(dataUpdatedList);

    // 2. SEQUENTIAL RANK SWAP (One step at a time)
    if (!isIdentical) {
      const nextList = [...dataUpdatedList]; // Use the fresh data version for swapping
      let changed = false;

      for (let i = 0; i < nextList.length - 1; i++) {
        const currentItem = nextList[i];
        const targetIndex = targetLeaderboard.findIndex(s => s.id === currentItem.id);
        if (targetIndex > i) {
          [nextList[i], nextList[i + 1]] = [nextList[i + 1], nextList[i]];
          changed = true;
          break;
        }
      }

      if (!changed) {
        for (let i = nextList.length - 1; i > 0; i--) {
          const currentItem = nextList[i];
          const targetIndex = targetLeaderboard.findIndex(s => s.id === currentItem.id);
          if (targetIndex < i) {
            [nextList[i], nextList[i - 1]] = [nextList[i - 1], nextList[i]];
            changed = true;
            break;
          }
        }
      }

      if (changed) {
        syncTimer.current = setTimeout(() => {
          setDisplayedList(nextList);
        }, 150);
        return () => clearTimeout(syncTimer.current);
      }
    }

    // 3. APPLY DATA UPDATES IF NO SWAP IS PENDING
    if (dataChanged) {
      setDisplayedList(dataUpdatedList);
    }

    return () => clearTimeout(syncTimer.current);
  }, [targetLeaderboard, displayedList, isAdmin]);

  // Final list to render
  const finalRenderList = isAdmin ? displayedList : targetLeaderboard;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', background: '#0B1222', color: 'white', fontFamily: "'DM Sans', sans-serif" }}>

      {/* HEADER - MATCHING SCREENSHOT */}
      <div style={{ padding: '32px 24px 24px', background: 'transparent' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>MARKET TERMINAL</h1>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569', opacity: 0.8 }}>{finalRenderList.length} Companies Tracked</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulse-emerald" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '10px', fontWeight: '900', color: '#10B981', letterSpacing: '1px', textTransform: 'uppercase' }}>Pure Realtime Sync</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-32">
        <AnimatePresence mode="popLayout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {finalRenderList.map((stock, i) => {
              const chg = stock.change;
              const isUp = chg > 0;
              const isNeutral = chg === 0;

              return (
                <motion.div
                  key={stock.id}
                  layout={isAdmin}
                  initial={isAdmin ? { opacity: 0, scale: 0.95 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={isAdmin ? { opacity: 0, scale: 0.95 } : false}
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 150,
                      damping: 18,
                      // Moving UP slightly faster logic can be handled by damping variation if needed,
                      // but global stiffness 150/18 is a balanced high-fidelity choice.
                    },
                    scale: { duration: 0.2 }
                  }}
                  // Scale deep effect during rank shift
                  whileHover={isAdmin ? { scale: 1.02, boxShadow: '0 8px 30px rgba(0,0,0,0.4)', zIndex: 10 } : {}}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    background: 'rgba(30, 41, 59, 0.4)',
                    borderRadius: '20px',
                    border: '1px solid rgba(51, 65, 85, 0.5)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onClick={() => navigate(`/stock/${stock.id}`)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: i < 3 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(51, 65, 85, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '900',
                      color: i < 3 ? '#F59E0B' : '#94A3B8',
                      border: i < 3 ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(51, 65, 85, 0.2)'
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '900', color: 'white' }}>{stock.symbol}</span>
                        {i < 3 && (
                          <span style={{
                            fontSize: '9px',
                            fontWeight: '900',
                            background: '#F59E0B',
                            color: '#451a03',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            textTransform: 'uppercase'
                          }}>
                            TOP
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>{stock.name}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '16px', fontWeight: '900', color: 'white', marginBottom: '2px' }}>₹{stock.price.toLocaleString()}</div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '900',
                      color: isNeutral ? '#94A3B8' : (isUp ? '#10B981' : '#EF4444'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '2px'
                    }}>
                      {isNeutral ? '•' : (isUp ? '▲' : '▼')}
                      {isNeutral ? '0.00%' : `${Math.abs(chg).toFixed(2)}%`}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: '#475569', fontWeight: '800', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.6 }}>End of Market Stream</p>
        </div>
      </div>

      <BottomNav active="home" />

    </div>
  );
};

export default AdminPanel;
