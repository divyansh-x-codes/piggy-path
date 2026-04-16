import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  onSnapshot,
  collection,
  runTransaction,
  getDoc,
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
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("AUTH_STATE_CHANGE:", firebaseUser?.uid || 'NO_USER');

      if (firebaseUser) {
        // Fetch profile once to set isAdmin before finishing loading
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userRef);

          const isSuperAdmin = firebaseUser.email === 'simplydivyanshk@gmail.com';

          if (userSnap.exists()) {
            const data = userSnap.data();
            console.log("PROFILE_LOADED:", data.role);
            setUserData(data);
            setIsAdmin(isSuperAdmin || data.role === 'admin');
          } else {
            console.log("PROFILE_MISSING - Initializing...");
            setIsAdmin(isSuperAdmin); // superadmin gets access even if doc is new
            // Optional: Create profile if missing
            const initialData = { balance: 100000, createdAt: Date.now() };
            // ...
          }
        } catch (e) {
          console.error("Auth Profile Fetch Error:", e);
        }
        setUser(firebaseUser);
      } else {
        console.log("USER_LOGGED_OUT");
        setUser(null);
        setIsAdmin(false);
        setUserData({ balance: 100000 });
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Debug Logs
  useEffect(() => {
    console.log("USER:", user?.uid);
    console.log("ADMIN:", isAdmin);
    console.log("LOADING:", loading);
  }, [user, isAdmin, loading]);

  // ─── FIRESTORE LISTENERS ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    // 1. User Profile Listener (keep for real-time balance updates)
    const userUnsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const isSuperAdmin = user.email === 'simplydivyanshk@gmail.com';
        setUserData(data);
        setIsAdmin(isSuperAdmin || data.role === 'admin');
      }
    });

    // 2. Portfolio Listener - STRICT holdings structure
    const portfolioUnsub = onSnapshot(doc(db, 'portfolios', user.uid), (snap) => {
      if (snap.exists()) setPortfolio(snap.data());
      else setPortfolio({ holdings: {} });
    });

    return () => {
      userUnsub();
      portfolioUnsub();
    };
  }, [user]);

  // 3. Global Stocks Listener + Auto-Seed Migration
  useEffect(() => {
    const stocksUnsub = onSnapshot(collection(db, 'stocks'), async (snap) => {
      // Check if we need to migrate (old stocks present or empty)
      const hasOldStocks = snap.docs.some(doc => !MOCK_STOCKS.find(s => s.id === doc.id));
      
      if ((snap.empty || hasOldStocks) && user) {
        console.log('[Firestore] Migration/Seed detected...');
        for (const stock of MOCK_STOCKS) {
          try {
            const ref = doc(db, 'stocks', stock.id);
            await runTransaction(db, async (tx) => {
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
          } catch (e) { console.error('Seed/Migration failed', e); }
        }
        return;
      }

      const stockMap = {};
      snap.forEach(doc => {
        stockMap[doc.id] = doc.data();
      });
      setStocks(stockMap);

      if (!currentStock && snap.docs.length > 0) {
        const firstId = snap.docs[0].id;
        const meta = MOCK_STOCKS.find(s => s.id === firstId) || snap.docs[0].data();
        setCurrentStock(meta);
      }
    });

    return () => stocksUnsub();
  }, [user, currentStock]);

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

        if (!stockSnap.exists()) throw "Stock not found";
        if (!userSnap.exists()) throw "User not found";

        const price = stockSnap.data().price;
        const totalValue = price * qty;

        // Common Portfolio Setup
        const holdings = portfolioSnap.exists() ? portfolioSnap.data().holdings || {} : {};
        const current = holdings[sid] || { qty: 0, avgPrice: 0 };

        if (type === 'buy') {
          if (userSnap.data().balance < totalValue) throw "Insufficient balance";

          // 1. Deduct Balance
          tx.update(userRef, { balance: userSnap.data().balance - totalValue });

          // 2. Update Portfolio
          const newQty = current.qty + qty;
          const newAvg = (current.qty * current.avgPrice + qty * price) / newQty;

          holdings[sid] = { qty: newQty, avgPrice: newAvg };
          tx.update(portfolioRef, { holdings });

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
      return { success: true };
    } catch (err) {
      console.error('Trade Error:', err);
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
      confirmTrade, applyIPO, forceSeed,
      STOCKS: MOCK_STOCKS
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
