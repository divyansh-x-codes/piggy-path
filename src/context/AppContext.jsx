import React, { createContext, useState, useContext, useEffect } from 'react';
import { STOCKS, NEWS, IPO_DATA } from '../data/mockData';
import { auth, db, functions } from '../lib/firebase';
import { io } from 'socket.io-client';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  doc, getDoc, onSnapshot, setDoc, serverTimestamp, 
  collection, query, orderBy, limit, deleteDoc, getDocs, where, updateDoc, increment, addDoc
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ─── INITIAL STATE RECOVERY FROM LOCAL STORAGE ───────────────────────────────
  const savedScreen = localStorage.getItem('piggy_screen') || 'splash';
  const savedStockId = localStorage.getItem('piggy_stockId');
  const savedWatchlist = JSON.parse(localStorage.getItem('piggy_watchlist') || '["msft", "aapl", "tcs"]');

  const [currentUser, setCurrentUser]     = useState(null);
  const [currentScreen, setCurrentScreen] = useState(savedScreen);
  const [prevScreens, setPrevScreens]     = useState([]);
  const [portfolio, setPortfolio]         = useState({});
  const [marketPrices, setMarketPrices]   = useState({});
  const [marketHistory, setMarketHistory] = useState({});
  const [socket, setSocket]               = useState(null);
  const [tradeHistory, setTradeHistory]   = useState([]);
  const [globalTrades, setGlobalTrades]   = useState([]);
  const [currentStock, setCurrentStock]   = useState(
    STOCKS.find(s => s.id === savedStockId) || null
  );
  const [ipoOrders, setIpoOrders]         = useState([]);
  const [watchlist, setWatchlist]         = useState(savedWatchlist);
  const [userData, setUserData]           = useState({
    name: '', level: 0, xp: 0, streak: 0,
    completedLevels: 0, balance: 100000, id: '#000000'
  });
  const [loading, setLoading] = useState(true);
  const [posts, setPosts]     = useState([]);

  // Sync Watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('piggy_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Sync currentStock to localStorage
  useEffect(() => {
    if (currentStock?.id) localStorage.setItem('piggy_stockId', currentStock.id);
  }, [currentStock]);

  // ─── GLOBAL TRADES LISTENER — ALL users, ALL stocks ──────────────────────────
  useEffect(() => {
    // REMOVED orderBy('createdAt') to allow instant local updates (latency compensation)
    const q = query(collection(db, 'transactions'), limit(500));
    const unsub = onSnapshot(q, (snap) => {
      const rawTrades = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort locally so we don't hide docs with pending server timestamps
      const sorted = rawTrades.sort((a, b) => {
        const tA = a.createdAt?.toMillis() || Date.now();
        const tB = b.createdAt?.toMillis() || Date.now();
        return tA - tB;
      });
      setGlobalTrades(sorted);
    }, (err) => console.warn('[GlobalTrades] Error:', err.message));
    return () => unsub();
  }, []);

  // ─── AUTH LISTENER — HARDENED WITH PERSISTENCE ────────────────────────────────
  // ... (lines omitted for brevity, keeping the existing auth listener logic)

  // ─── AUTH LISTENER — HARDENED WITH PERSISTENCE ────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        // Keep track of which snapshots have arrived to prevent empty flashes
        let userInited = false;
        let portInited = false;
        const checkDone = () => {
          if (userInited && portInited) {
            setCurrentScreen(prev => (prev === 'auth' || prev === 'splash') ? 'home' : prev);
            setLoading(false);
          }
        };

        // 1. User Profile Listener
        const userDocRef = doc(db, 'users', user.uid);
        const unsubUser = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const fallbackName = user.email ? user.email.split('@')[0] : 'Investor';
            setUserData(prev => ({
              ...prev, ...data,
              name: data.username || data.name || fallbackName
            }));
          } else {
            setDoc(userDocRef, { name: 'Investor', balance: 100000, createdAt: serverTimestamp() }, { merge: true });
          }
          userInited = true;
          checkDone();
        });

        // 2. Portfolio Listener
        const qPortfolio = query(collection(db, 'portfolio'), where('userId', '==', user.uid));
        const unsubPortfolio = onSnapshot(qPortfolio, (snapshot) => {
          const holdings = {};
          snapshot.docs.forEach(d => {
            const data = d.data();
            if ((data.quantity || 0) > 0) holdings[data.stockId] = { quantity: data.quantity, avgPrice: data.avgPrice };
          });
          setPortfolio(holdings);
          portInited = true;
          checkDone();
        });

        // 3. Trade History
        const qTx = query(collection(db, 'transactions'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
        const unsubTx = onSnapshot(qTx, (snapshot) => {
          setTradeHistory(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
        });

        // SAFETY: If snapshots take too long, force end loading after 3s
        const timeout = setTimeout(() => { userInited = true; portInited = true; checkDone(); }, 3000);

        return () => {
          clearTimeout(timeout);
          unsubUser();
          unsubPortfolio();
          unsubTx();
        };
      } else {
        setCurrentUser(null);
        setUserData({ name: '', balance: 100000 });
        setPortfolio({});
        setTradeHistory([]);
        setCurrentScreen('auth');
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // ─── SOCKET.IO (optional backend, gracefully skipped if offline) ──────────────
  const getBaseUrl = () =>
    window.location.hostname === 'localhost'
      ? 'http://localhost:5000'
      : 'http://10.0.2.2:5000';

  useEffect(() => {
    const newSocket = io(getBaseUrl(), {
      transports: ['polling', 'websocket'],
      withCredentials: true,
      reconnectionAttempts: 3,
      timeout: 5000,
    });
    setSocket(newSocket);
    newSocket.on('priceUpdate', (data) => {
      if (!data?.id) return;
      setMarketPrices(prev => ({ ...prev, [data.id]: data.price }));
      if (data.history) setMarketHistory(prev => ({ ...prev, [data.id]: data.history }));
    });
    newSocket.on('connect_error', (err) => {
      console.warn('[Socket] Backend offline, local mode:', err.message);
    });
    return () => newSocket.disconnect();
  }, []);

  // ─── NAVIGATION ───────────────────────────────────────────────────────────────
  const goScreen = (id, addHistory = true) => {
    if (addHistory && currentScreen !== id) setPrevScreens([...prevScreens, currentScreen]);
    else if (!addHistory) setPrevScreens([]);
    setCurrentScreen(id);
    localStorage.setItem('piggy_screen', id);
  };

  const goBack = () => {
    const newPrev = [...prevScreens];
    const prev = newPrev.pop();
    setPrevScreens(newPrev);
    const target = prev || (currentUser ? 'home' : 'auth');
    setCurrentScreen(target);
    localStorage.setItem('piggy_screen', target);
  };

  // ─── GLOBAL PRICE = basePrice + impact of ALL users' trades ──────────────────
  // Price Impact = Base Impact (1.2%) + Liquidity Factor (0.01% per share)
  const getPrice = (s) => {
    if (!s) return 0;
    let price = marketPrices[s.id] || s.basePrice;
    const stockTrades = globalTrades.filter(t => t.stockId === s.id);
    
    stockTrades.forEach(t => {
      const type = t.type || t.tradeType;
      const qty = t.quantity || 1;
      
      if (type === 'buy') {
        const impact = 1.012 + (qty * 0.0001); // 1.2% + 0.01% per share
        price = +(price * Math.min(impact, 1.15)).toFixed(2); // Cap single trade impact at 15%
      } else if (type === 'sell') {
        const impact = 0.991 - (qty * 0.00008); // -0.9% - 0.008% per share
        price = +(price * Math.max(impact, 0.85)).toFixed(2); // Floor single trade impact at -15%
      }
    });
    return price;
  };

  // ─── PORTFOLIO VALUE (using live prices) ─────────────────────────────────────
  const getPortfolioValue = () => {
    return Object.entries(portfolio).reduce((sum, [id, h]) => {
      const stock = STOCKS.find(s => s.id === id);
      return sum + (stock ? getPrice(stock) : 0) * (h.quantity || 0);
    }, 0);
  };

  // ─── UPDATE PORTFOLIO IN FIRESTORE + CONTEXT ─────────────────────────────────
  const updatePortfolio = (stockId, newQty, newAvgPrice) => {
    console.log(`[AppContext] updatePortfolio: ${stockId}, Qty: ${newQty}, Avg: ${newAvgPrice}`);
    
    // Update local state immediately (Optimistic UI)
    setPortfolio(prev => ({
      ...prev,
      [stockId]: newQty <= 0
        ? { quantity: 0, avgPrice: 0 }
        : { quantity: newQty, avgPrice: newAvgPrice }
    }));

    // Persist to Firestore
    if (currentUser) {
      const portRef = doc(db, 'portfolio', `${currentUser.uid}_${stockId}`);
      return setDoc(portRef, {
        userId: currentUser.uid,
        stockId,
        quantity: newQty,
        avgPrice: newAvgPrice,
        updatedAt: serverTimestamp()
      }, { merge: true }).catch(err => {
        console.error('[Portfolio] Firestore sync failed:', err.message);
        throw err; // Bubbling up to caller
      });
    }
    return Promise.resolve();
  };

  // ─── UPDATE BALANCE IN FIRESTORE + CONTEXT ───────────────────────────────────
  const updateBalance = (delta) => {
    console.log(`[AppContext] updateBalance delta: ${delta}`);
    setUserData(prev => ({ ...prev, balance: (prev.balance || 0) + delta }));
    
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      return updateDoc(userRef, { balance: increment(delta) }).catch(err => {
        console.error('[Balance] Update failed:', err.message);
        // Fallback if updateDoc fails (doc might not exist)
        return setDoc(userRef, { balance: 100000 + delta }, { merge: true });
      });
    }
    return Promise.resolve();
  };

  // ─── RECORD TRADE IN FIRESTORE ───────────────────────────────────────────────
  const recordTrade = (stockId, type, qty, price) => {
    console.log(`[AppContext] recordTrade: ${stockId}, ${type}, ${qty} @ ${price}`);
    if (!currentUser) return Promise.resolve();
    
    return addDoc(collection(db, 'transactions'), {
      userId: currentUser.uid,
      stockId,
      type,
      quantity: qty,
      price,
      total: price * qty,
      createdAt: serverTimestamp()
    }).catch(err => {
      console.error('[Trade] Record failed:', err.message);
      throw err;
    });
  };

  const openStockDetail = (stockId) => {
    const s = STOCKS.find(x => x.id === stockId);
    if (s) { setCurrentStock(s); goScreen('stock-detail'); }
  };

  const applyIPO = async (ipoData) => {
    if (!currentUser) return false;
    try {
      const amount = parseFloat(ipoData.minInv.replace(/,/g, ''));
      const processIpo = httpsCallable(functions, 'applyIpo');
      const res = await processIpo({ ipoId: ipoData.id, amount });
      if (res.data.success) { setIpoOrders(prev => [...prev, res.data.order]); return true; }
      return false;
    } catch (err) { alert(err.message); return false; }
  };

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
      return onSnapshot(q, (snap) => {
        setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    } catch (err) { console.error('fetchPosts error:', err); }
  };

  const handleLike = async (postId) => {
    if (!currentUser) return;
    try {
      const likeRef = doc(db, 'likes', `${currentUser.uid}_${postId}`);
      const likeSnap = await getDoc(likeRef);
      if (likeSnap.exists()) await deleteDoc(likeRef);
      else await setDoc(likeRef, { userId: currentUser.uid, postId, createdAt: serverTimestamp() });
    } catch (err) { console.error('Like failed:', err); }
  };

  const confirmTrade = () => console.warn('confirmTrade deprecated');

  // ─── SPLASH LOADING SCREEN ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display:'flex', flex:1, flexDirection:'column', alignItems:'center', justifyContent:'center', background:'white', minHeight:'100vh' }}>
        <div style={{ display:'flex', alignItems:'baseline', fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:42, letterSpacing:'-1px' }}>
          <span>PiggyPath</span>
          <span style={{ color:'#7C3AED' }}>.</span>
        </div>
        <p style={{ color:'#6b7280', marginTop:10, fontSize:15, fontFamily:"'DM Sans', sans-serif" }}>Learn. Invest. Grow.</p>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      currentUser, currentScreen, goScreen, goBack,
      portfolio, setPortfolio, tradeHistory, globalTrades, currentStock, ipoOrders,
      watchlist, setWatchlist, userData, setUserData, marketHistory, marketPrices,
      getPrice, getPortfolioValue, openStockDetail, confirmTrade, applyIPO,
      posts, fetchPosts, handleLike, setCurrentStock,
      updatePortfolio, updateBalance, recordTrade,
      // kept for backwards compat
      addLocalTrade: (stockId, type) => {} // no-op, now handled via Firestore globalTrades
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
