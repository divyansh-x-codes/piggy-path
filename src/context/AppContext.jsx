import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  collection,
  runTransaction,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { STOCKS as MOCK_STOCKS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ─── STATED ─────────────────────────────────────────────────────────────
  const navigate = useNavigate();
  const [currentStock, setCurrentStock] = useState(null);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState({ balance: 100000 });
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState({ holdings: {} }); // STRICT STRUCTURE
  const [stocks, setStocks] = useState({});
  const [ipoOrders, setIpoOrders] = useState([]);
  const [watchlist, setWatchlist] = useState(['msft', 'aapl', 'googl']);

  // ─── AUTH LISTENER ────────────────────────────────────────────────────────
  // ─── FIRESTORE DATA FETCHERS (NO MORE LISTENERS) ──────────────────────────
  const fetchUserData = useCallback(async (uid) => {
    if (!uid) return;
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setUserData(data);
        setIsAdmin(auth.currentUser?.email === 'simplydivyanshk@gmail.com' || data.role === 'admin');
      }
    } catch (e) { console.error("Fetch Profile Error:", e); }
  }, []);

  const fetchPortfolio = useCallback(async (uid) => {
    if (!uid) return;
    try {
      const portfolioRef = doc(db, 'portfolios', uid);
      const snap = await getDoc(portfolioRef);
      if (snap.exists()) setPortfolio(snap.data());
      else setPortfolio({ holdings: {} });
    } catch (e) { console.error("Fetch Portfolio Error:", e); }
  }, []);

  const fetchStocks = useCallback(async () => {
    try {
      console.log("[Firestore] Fetching Stocks (One-time)...");
      const snap = await getDocs(collection(db, 'stocks'));
      
      let stockMap = {};
      if (snap.empty) {
        // Simple auto-seed if empty
        console.log('[Firestore] Seeding stocks...');
        for (const stock of MOCK_STOCKS) {
          await setDoc(doc(db, 'stocks', stock.id), {
            name: stock.name, ticker: stock.ticker, 
            price: stock.basePrice, prevPrice: stock.basePrice,
            history: [stock.basePrice],
            updatedAt: Date.now()
          });
        }
        const reSnap = await getDocs(collection(db, 'stocks'));
        reSnap.forEach(doc => stockMap[doc.id] = doc.data());
      } else {
        snap.forEach(doc => stockMap[doc.id] = doc.data());
      }

      // ─── AUTO-SEED MISSING STOCKS (including SnacQo) ───
      for (const stock of MOCK_STOCKS) {
        if (!stockMap[stock.id]) {
          console.log(`[Firestore] Seeding missing stock: ${stock.id}`);
          const xadsRef = doc(db, 'stocks', stock.id);
          await setDoc(xadsRef, { 
            name: stock.name, 
            symbol: stock.ticker,
            price: stock.basePrice, 
            prevPrice: stock.basePrice, 
            history: [stock.basePrice], 
            updatedAt: Date.now() 
          }, { merge: true });
          stockMap[stock.id] = { 
            name: stock.name, 
            symbol: stock.ticker,
            price: stock.basePrice, 
            prevPrice: stock.basePrice, 
            history: [stock.basePrice]
          };
        }
      }

      // ─── FORCED SYNC FOR USER REQUEST (XADS Price = 80) ───
      if (stockMap['xads'] && (stockMap['xads'].price !== 80 || stockMap['xads'].prevPrice !== 80)) {
        const xadsRef = doc(db, 'stocks', 'xads');
        await setDoc(xadsRef, { 
          price: 80, 
          prevPrice: 80, 
          history: [80], 
          updatedAt: Date.now() 
        }, { merge: true });
        stockMap['xads'].price = 80;
        stockMap['xads'].prevPrice = 80;
        stockMap['xads'].history = [80];
      }

      setStocks(stockMap);
    } catch (e) { console.error("Fetch Stocks Error:", e); }
  }, []);

  // ─── AUTH + INITIAL LOAD ───────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("---------- AUTH_STATE_CHANGE ----------");
      console.log("UID:", firebaseUser?.uid || 'NO_USER');
      
      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          let currentProfile;
          if (!userSnap.exists()) {
            console.log("[AppContext] PROFILE_MISSING - Initializing new user");
            currentProfile = { 
              balance: 100000, 
              role: firebaseUser.email === 'simplydivyanshk@gmail.com' ? 'admin' : 'user',
              displayName: firebaseUser.displayName || 'Investor',
              email: firebaseUser.email,
              createdAt: Date.now() 
            };
            await setDoc(userRef, currentProfile);
            await setDoc(doc(db, 'portfolios', firebaseUser.uid), { holdings: {}, updatedAt: Date.now() });
          } else {
            currentProfile = userSnap.data();
          }
          
          setUserData(currentProfile);
          setIsAdmin(firebaseUser.email === 'simplydivyanshk@gmail.com' || currentProfile.role === 'admin');
          console.log("[AppContext] Admin Status:", (firebaseUser.email === 'simplydivyanshk@gmail.com' || currentProfile.role === 'admin'));
          
          // Parallel fetch to speed up loading
          await Promise.all([
            fetchStocks(),
            fetchPortfolio(firebaseUser.uid)
          ]);
        } else {
          setUser(null);
          setUserData({ balance: 100000 });
          setPortfolio({ holdings: {} });
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("CRITICAL_AUTH_INIT_ERROR:", err);
      } finally {
        setLoading(false);
        console.log("[AppContext] Loading finished.");
      }
    });
    return unsubscribe;
  }, [fetchStocks, fetchPortfolio]);

  // Debug Logs
  useEffect(() => {
    console.log("USER:", user?.uid);
    console.log("ADMIN:", isAdmin);
    console.log("LOADING:", loading);
  }, [user, isAdmin, loading]);

  // ─── FIRESTORE LISTENERS REMOVED FOR COST OPTIMIZATION ────────────────────

  const getPrice = useCallback((s) => {
    if (!s) return 0;
    return stocks[s.id]?.price || s.basePrice || 0;
  }, [stocks]);

  const getChange = useCallback((s) => {
    if (!s) return 0;
    const current = getPrice(s);
    const base = s.basePrice || 100;
    return Number((((current - base) / base) * 100).toFixed(2));
  }, [getPrice]);

  const getPriceHistory = useCallback((stockId) => {
    return stocks[stockId]?.history || [100, 100];
  }, [stocks]);

  const getPortfolioValue = useCallback(() => {
    const holdings = portfolio.holdings || {};
    return Object.entries(holdings).reduce((sum, [id, h]) => {
      const stock = MOCK_STOCKS.find(s => s.id === id);
      if (!stock || !h || h.qty <= 0) return sum;
      return sum + getPrice(stock) * h.qty;
    }, 0);
  }, [portfolio, getPrice]);

  // ─── BUY/SELL TRANSACTION (STRICT LOGIC) ──────────────────────────────────
  const confirmTrade = async (type, stockId, quantity) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    const qty = parseInt(quantity) || 0;
    if (qty <= 0) return { success: false, error: 'Invalid quantity' };

    const sid = stockId.toLowerCase();
    const stockRef = doc(db, "stocks", sid);
    const userRef = doc(db, "users", user.uid);
    const portfolioRef = doc(db, "portfolios", user.uid);

    try {
      await runTransaction(db, async (tx) => {
        const stockSnap = await tx.get(stockRef);
        const userSnap = await tx.get(userRef);
        const portfolioSnap = await tx.get(portfolioRef);

        if (!stockSnap.exists()) throw "Stock not found in Firestore. Please wait for seeding...";
        if (!userSnap.exists()) throw "User profile not found. Please refresh page.";

        const price = stockSnap.data().price;
        const totalValue = price * qty;
        const userData = userSnap.data();

        // Common Portfolio Setup - Handle missing doc gracefully
        const holdings = portfolioSnap.exists() ? portfolioSnap.data().holdings || {} : {};
        const current = holdings[sid] || { qty: 0, avgPrice: 0 };

        if (type === 'buy') {
          if (userData.balance < totalValue) throw "Insufficient balance (Balance: ₹" + Math.floor(userData.balance) + ")";

          // 1. Deduct Balance
          tx.update(userRef, { balance: userData.balance - totalValue });

          // 2. Update Portfolio
          const newQty = current.qty + qty;
          const newAvg = (current.qty * (current.avgPrice || price) + qty * price) / newQty;

          holdings[sid] = { qty: newQty, avgPrice: newAvg };
          tx.set(portfolioRef, { holdings, updatedAt: Date.now() }, { merge: true });

          // 3. GLOBAL PRICE IMPACT (+2%)
          const newPrice = +(price * 1.02).toFixed(2);
          const history = stockSnap.data().history || [];
          tx.update(stockRef, { price: newPrice, history: [...history.slice(-49), newPrice], updatedAt: Date.now() });

        } else {
          // SELL
          if (current.qty < qty) throw "Insufficient holdings";

          // 1. Add to Balance
          tx.update(userRef, { balance: userSnap.data().balance + totalValue });

          // 2. Update Portfolio
          const newQty = current.qty - qty;
          if (newQty <= 0) delete holdings[sid];
          else holdings[sid] = { ...current, qty: newQty };

          tx.update(portfolioRef, { holdings });

          // 3. GLOBAL PRICE IMPACT (-2%)
          const newPrice = +(price * 0.98).toFixed(2);
          const history = stockSnap.data().history || [];
          tx.update(stockRef, { price: newPrice, history: [...history.slice(-49), newPrice], updatedAt: Date.now() });
        }
      });
      
      // OPTIMIZATION: Manually refresh local data after success to avoid idle listeners
      await fetchUserData(user.uid);
      await fetchPortfolio(user.uid);
      await fetchStocks();
      
      return { success: true };
    } catch (err) {
      console.error('Trade Error:', err);
      return { success: false, error: err.toString() };
    }
  };

  const resetData = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    try {
      console.log("[Reset] Resetting all market and user data...");
      
      // 1. Reset Portfolio for current user
      await setDoc(doc(db, 'portfolios', user.uid), { 
        holdings: {}, 
        updatedAt: Date.now() 
      });
      
      // 2. Reset User Balance to 100,000
      await setDoc(doc(db, 'users', user.uid), { 
        balance: 100000, 
        updatedAt: Date.now() 
      }, { merge: true });

      // 3. Reset All Stock Prices to their base values (from MOCK_STOCKS)
      for (const stock of MOCK_STOCKS) {
        const stockRef = doc(db, 'stocks', stock.id);
        await setDoc(stockRef, {
          price: stock.basePrice || 80,
          prevPrice: stock.basePrice || 80, // ADD THIS
          history: [stock.basePrice || 80],
          updatedAt: Date.now()
        }, { merge: true });
      }

      // 4. Manual local refresh
      await fetchUserData(user.uid);
      await fetchPortfolio(user.uid);
      await fetchStocks();

      console.log("[Reset] Reset complete!");
      return { success: true };
    } catch (err) {
      console.error('Reset Error:', err);
      return { success: false, error: err.toString() };
    }
  };

  const forceSeed = async () => {
    console.log('[Firestore] Manual seed triggered...');
    for (const stock of MOCK_STOCKS) {
      try {
        await runTransaction(db, async (tx) => {
          const ref = doc(db, 'stocks', stock.id);
          tx.set(ref, {
            name: stock.name,
            symbol: stock.ticker,
            price: stock.basePrice,
            prevPrice: stock.basePrice,
            history: [stock.basePrice],
            updatedAt: Date.now(),
            lastUpdated: serverTimestamp()
          });
        });
      } catch (e) {
        console.error('Seed failed', e);
        throw e;
      }
    }
  };

  const applyIPO = (ipoData) => {
    setIpoOrders(prev => [...prev, { name: ipoData.name, ts: Date.now() }]);
    return true;
  };

  return (
    <AppContext.Provider value={{
      portfolio, tradeHistory: [],
      currentStock, setCurrentStock,
      ipoOrders, watchlist, setWatchlist, userData, setUserData, user,
      isAdmin, loading,
      stocks, // Add this
      getPrice, getChange, getPriceHistory, getPortfolioValue,
      confirmTrade, applyIPO, forceSeed, resetData,
      STOCKS: MOCK_STOCKS
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
