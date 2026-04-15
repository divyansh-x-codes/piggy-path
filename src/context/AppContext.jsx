import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [prevScreens, setPrevScreens]     = useState([]);
  const [currentStock, setCurrentStock]   = useState(null);

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState({ balance: 100000 });
  const [portfolio, setPortfolio] = useState({ holdings: {} }); // STRICT STRUCTURE
  const [stocks, setStocks] = useState({}); 
  const [ipoOrders, setIpoOrders] = useState([]);
  const [watchlist, setWatchlist] = useState(['msft', 'aapl', 'googl']);

  // ─── AUTH LISTENER ────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        // Ensure user doc exists
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          tx.set(userRef, { balance: 100000, createdAt: Date.now() });
        }
        
        if (currentScreen === 'splash' || currentScreen === 'auth') {
          setCurrentScreen('home');
        }
      } else {
        setCurrentScreen('auth');
      }
    });
    return unsubscribe;
  }, []);

  // ─── FIRESTORE LISTENERS ──────────────────────────────────────────────────
  useEffect(() => {
    if (!user) return;

    // 1. User Profile Listener
    const userUnsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) setUserData(snap.data());
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

  // 3. Global Stocks Listener + Auto-Seed
  useEffect(() => {
    const stocksUnsub = onSnapshot(collection(db, 'stocks'), async (snap) => {
      if (snap.empty && user) {
        console.log('[Firestore] Empty stocks detected. Auto-seeding...');
        for (const stock of MOCK_STOCKS) {
          try {
            await runTransaction(db, async (tx) => {
              const ref = doc(db, 'stocks', stock.id);
              tx.set(ref, {
                name: stock.name,
                symbol: stock.ticker,
                price: stock.basePrice,
                history: [stock.basePrice],
                updatedAt: Date.now()
              });
            });
          } catch (e) { console.error('Auto-seed failed', e); }
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
        setCurrentStock(MOCK_STOCKS.find(s => s.id === firstId) || snap.docs[0].data());
      }
    });
    return stocksUnsub;
  }, [user, currentStock]);

  // ─── HELPERS ──────────────────────────────────────────────────────────────
  const goScreen = (id, addHistory = true) => {
    if (addHistory && currentScreen !== id) setPrevScreens(prev => [...prev, currentScreen]);
    setCurrentScreen(id);
  };

  const goBack = () => {
    const newPrev = [...prevScreens];
    const prev = newPrev.pop();
    setPrevScreens(newPrev);
    setCurrentScreen(prev || 'home');
  };

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

    const stockRef = doc(db, "stocks", stockId);
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

        if (type === 'buy') {
          if (userSnap.data().balance < totalValue) throw "Insufficient balance";

          // 1. Deduct Balance
          tx.update(userRef, {
            balance: userSnap.data().balance - totalValue
          });

          // 2. Update Portfolio
          const holdings = portfolioSnap.exists() ? portfolioSnap.data().holdings || {} : {};
          const current = holdings[stockId] || { qty: 0, avgPrice: 0 };
          const newQty = current.qty + qty;
          const newAvg = (current.qty * current.avgPrice + qty * price) / newQty;
          
          holdings[stockId] = { qty: newQty, avgPrice: newAvg };
          tx.set(portfolioRef, { holdings }, { merge: true });

          // 3. GLOBAL PRICE IMPACT (+2%)
          const newPrice = +(price * 1.02).toFixed(2);
          const history = stockSnap.data().history || [];
          const newHistory = [...history.slice(-49), newPrice];

          tx.update(stockRef, {
            price: newPrice,
            history: newHistory,
            updatedAt: Date.now()
          });

        } else {
          // SELL
          const holdings = portfolioSnap.exists() ? portfolioSnap.data().holdings || {} : {};
          const current = holdings[stockId] || { qty: 0, avgPrice: 0 };
          if (current.qty < qty) throw "Insufficient holdings";

          // 1. Add to Balance
          tx.update(userRef, {
            balance: userSnap.data().balance + totalValue
          });

          // 2. Update Portfolio
          const newQty = current.qty - qty;
          if (newQty <= 0) {
            delete holdings[stockId];
          } else {
            holdings[stockId] = { ...current, qty: newQty };
          }
          tx.set(portfolioRef, { holdings }, { merge: true });

          // 3. GLOBAL PRICE IMPACT (-2%)
          const newPrice = +(price * 0.98).toFixed(2);
          const history = stockSnap.data().history || [];
          const newHistory = [...history.slice(-49), newPrice];

          tx.update(stockRef, {
            price: newPrice,
            history: newHistory,
            updatedAt: Date.now()
          });
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
            history: [stock.basePrice],
            updatedAt: Date.now()
          });
        });
      } catch (e) {
        console.error('Seed failed', e);
        throw e;
      }
    }
  };

  const openStockDetail = (stockId) => {
    const s = MOCK_STOCKS.find(x => x.id === stockId);
    if (s) { setCurrentStock(s); goScreen('stock-detail'); }
  };

  const applyIPO = (ipoData) => {
    setIpoOrders(prev => [...prev, { name: ipoData.name, ts: Date.now() }]);
    return true;
  };

  return (
    <AppContext.Provider value={{
      currentScreen, goScreen, goBack,
      portfolio, tradeHistory: [], 
      currentStock, setCurrentStock,
      ipoOrders, watchlist, setWatchlist, userData, setUserData, user,
      getPrice, getChange, getPriceHistory, getPortfolioValue,
      openStockDetail, confirmTrade, applyIPO, forceSeed,
      STOCKS: MOCK_STOCKS
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
