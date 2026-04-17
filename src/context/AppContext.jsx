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
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  addDoc,
  deleteDoc
} from 'firebase/firestore';
import { STOCKS as MOCK_STOCKS } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ─── STATED ─────────────────────────────────────────────────────────────
  const navigate = useNavigate();
  const [currentStock, setCurrentStock] = useState(null);

  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState({ balance: 50000 });
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState({ holdings: {} }); // STRICT STRUCTURE
  const [stocks, setStocks] = useState({});
  const [ipoOrders, setIpoOrders] = useState([]);
  const [articles, setArticles] = useState([]);
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
        setIsAdmin(
          auth.currentUser?.email === 'simplydivyanshk@gmail.com' || 
          auth.currentUser?.email === 'divyansh.coredev@gmail.com' || 
          data.role === 'admin'
        );
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

      setStocks(stockMap);
    } catch (e) { console.error("Fetch Stocks Error:", e); }
  }, []);

  // ─── AUTH + INITIAL LOAD ───────────────────────────────────────────────────
  useEffect(() => {
    let unsubProfile = null;
    let unsubPortfolio = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("---------- AUTH_STATE_CHANGE ----------");
      console.log("UID:", firebaseUser?.uid || 'NO_USER');
      
      // Clear existing listeners
      if (unsubProfile) unsubProfile();
      if (unsubPortfolio) unsubPortfolio();

      try {
        if (firebaseUser) {
          setUser(firebaseUser);
          
          // 1. Live Profile Listener
          const userRef = doc(db, 'users', firebaseUser.uid);
          unsubProfile = onSnapshot(userRef, (snap) => {
            if (snap.exists()) setUserData(snap.data());
          });

          // 2. Live Portfolio Listener
          const portfolioRef = doc(db, 'portfolios', firebaseUser.uid);
          unsubPortfolio = onSnapshot(portfolioRef, (snap) => {
            if (snap.exists()) setPortfolio(snap.data());
            else setPortfolio({ holdings: {} });
          });

          // Initial profile check for new users
          const userSnap = await getDoc(userRef);
          if (!userSnap.exists()) {
            console.log("[AppContext] INITIALIZING NEW USER");
            const newProfile = { 
              balance: 50000, 
              portfolioValue: 50000,
              role: (firebaseUser.email === 'simplydivyanshk@gmail.com' || firebaseUser.email === 'divyansh.coredev@gmail.com') ? 'admin' : 'user',
              displayName: firebaseUser.displayName || 'Investor',
              email: firebaseUser.email,
              createdAt: Date.now() 
            };
            await setDoc(userRef, newProfile);
            await setDoc(doc(db, 'portfolios', firebaseUser.uid), { holdings: {}, updatedAt: Date.now() });
          } else {
            setIsAdmin(firebaseUser.email === 'simplydivyanshk@gmail.com' || userSnap.data().role === 'admin');
          }
          
          // One-time fetch of stocks (market fallback)
          fetchStocks();
        } else {
          setUser(null);
          setUserData({ balance: 50000 });
          setPortfolio({ holdings: {} });
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("CRITICAL_AUTH_INIT_ERROR:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubProfile) unsubProfile();
      if (unsubPortfolio) unsubPortfolio();
    };
  }, [fetchStocks]);

  // ─── MARKET DATA LISTENERS (CENTRALIZED & PROPER REAL-TIME) ───────────
  useEffect(() => {
    console.log("[AppContext] Subscribing to LIVE Stock Collection...");
    
    // Listen to ALL stock documents for instant updates across the app
    const unsubStocks = onSnapshot(collection(db, 'stocks'), (snap) => {
      let stockMap = {};
      snap.forEach(doc => {
        stockMap[doc.id] = doc.data();
      });
      
      if (Object.keys(stockMap).length > 0) {
        setStocks(prev => ({ ...prev, ...stockMap }));
      }
    });

    // Keep the leaderboard listener as a fallback for metadata, but stocks-direct is authoritative
    const unsubMarket = onSnapshot(doc(db, 'leaderboard', 'global'), (snap) => {
      if (snap.exists()) {
        const marketData = snap.data().data || snap.data().topGainers || [];
        let stockMap = {};
        marketData.forEach(item => { if (item.id) stockMap[item.id] = item; });
        if (Object.keys(stockMap).length > 0) {
          setStocks(prev => ({ ...prev, ...stockMap }));
        }
      }
    });

    // ─── ARTICLES LISTENER ───
    const articlesQuery = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
    const unsubArticles = onSnapshot(articlesQuery, (snap) => {
      const artList = [];
      snap.forEach(d => artList.push({ id: d.id, ...d.data() }));
      setArticles(artList);
    });

    return () => {
      unsubStocks();
      unsubMarket();
      unsubArticles();
    };
  }, [user?.uid]);

  // Debug Logs
  useEffect(() => {
    console.log("USER:", user?.uid);
    console.log("ADMIN:", isAdmin);
    console.log("ARTICLES:", articles.length);
  }, [user, isAdmin, articles]);

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

  // ─── ADMIN PRICE MANIPULATION ─────────────────────────────────────────────
  const manipulatePrice = async (stockId, changePercent) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };
    const sid = stockId.toLowerCase();
    const stockRef = doc(db, 'stocks', sid);

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(stockRef);
        if (!snap.exists()) throw "Stock not found";

        const currentPrice = snap.data().price;
        const newPrice = +(currentPrice * (1 + changePercent / 100)).toFixed(2);
        const history = snap.data().history || [];

        tx.update(stockRef, {
          price: newPrice,
          history: [...history.slice(-49), newPrice],
          updatedAt: Date.now()
        });
      });
      return { success: true };
    } catch (e) {
      console.error("Manipulation Error:", e);
      return { success: false, error: e.toString() };
    }
  };

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
        const totalCost = price * qty;
        const userData = userSnap.data();

        // Common Portfolio Setup - Handle missing doc gracefully
        const holdings = portfolioSnap.exists() ? portfolioSnap.data().holdings || {} : {};
        const current = holdings[sid] || { qty: 0, avgPrice: 0 };

        if (type === 'buy') {
          // ─── 10 UNIT PER-TRANSACTION LIMIT ───
          if (qty > 10) {
            throw "Maximum 10 shares per order! You can buy again in a separate transaction.";
          }

          if (userData.balance < totalCost) throw "Insufficient balance (Balance: ₹" + Math.floor(userData.balance) + ")";

          // 1. New Balance
          const newBalance = userData.balance - totalCost;

          // 2. Update Portfolio
          const newQty = current.qty + qty;
          const newAvg = (current.qty * (current.avgPrice || price) + qty * price) / newQty;

          holdings[sid] = { qty: newQty, avgPrice: newAvg };
          tx.set(portfolioRef, { holdings, updatedAt: Date.now() }, { merge: true });

          // 3. Calculate Total Portfolio Value (for Leaderboard)
          // We need current prices for all holdings to get 100% accurate ranking
          // Since only 14 stocks exist, we can fetch them or use current traded price as authoritative for sid
          let totalAssetsValue = 0;
          for (const [holdId, h] of Object.entries(holdings)) {
            let hPrice = 0;
            if (holdId === sid) {
                hPrice = price; // Current market price before this trade impact? 
                // Technically buying moves price UP, but we use the price at which user bought
            } else {
                // For other stocks, we'd ideally fetch, but for efficiency we'll use state or a quick set of gets
                // To keep transaction small, we'll use the 'stocks' state from context which is synced
                hPrice = stocks[holdId]?.price || MOCK_STOCKS.find(s => s.id === holdId)?.basePrice || 0;
            }
            totalAssetsValue += (h.qty * hPrice);
          }

          tx.update(userRef, { 
            balance: newBalance,
            portfolioValue: Number((newBalance + totalAssetsValue).toFixed(2))
          });

          // 4. GLOBAL PRICE IMPACT (+2%)
          const newPrice = +(price * 1.02).toFixed(2);
          const history = stockSnap.data().history || [];
          tx.update(stockRef, { price: newPrice, history: [...history.slice(-49), newPrice], updatedAt: Date.now() });

        } else {
          // SELL
          if (current.qty < qty) throw "Insufficient holdings";

          // 1. New Balance
          const newBalance = userSnap.data().balance + totalCost;

          // 2. Update Portfolio
          const newQty = current.qty - qty;
          if (newQty <= 0) delete holdings[sid];
          else holdings[sid] = { ...current, qty: newQty };

          tx.update(portfolioRef, { holdings });

          // 3. Calculate Total Portfolio Value
          let totalAssetsValue = 0;
          for (const [holdId, h] of Object.entries(holdings)) {
            let hPrice = 0;
            if (holdId === sid) hPrice = price;
            else hPrice = stocks[holdId]?.price || MOCK_STOCKS.find(s => s.id === holdId)?.basePrice || 0;
            totalAssetsValue += (h.qty * hPrice);
          }

          tx.update(userRef, { 
            balance: newBalance,
            portfolioValue: Number((newBalance + totalAssetsValue).toFixed(2))
          });

          // 4. GLOBAL PRICE IMPACT (-2%)
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

      // 2. Reset User Balance to 50,000
      await setDoc(doc(db, 'users', user.uid), {
        balance: 50000,
        portfolioValue: 50000,
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

  // ─── ARTICLE PUBLISHING ───
  const publishArticle = async (articleData) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };
    try {
      await addDoc(collection(db, 'articles'), {
        ...articleData,
        createdAt: serverTimestamp(),
        author: user?.displayName || 'Admin',
        likes: 0,
        views: 0,
        comments: 0
      });
      return { success: true };
    } catch (e) {
      console.error('Publish Error:', e);
      return { success: false, error: e.toString() };
    }
  };

  const deleteArticle = async (articleId) => {
    if (!isAdmin) return { success: false, error: 'Unauthorized' };
    try {
      await deleteDoc(doc(db, 'articles', articleId));
      return { success: true };
    } catch (e) {
      console.error('Delete Error:', e);
      return { success: false, error: e.toString() };
    }
  };

  const forceSeed = async () => {
    console.log('[Firestore] Exclusive Seed Triggered — Removing unknown companies...');
    try {
      // 1. Get all current stocks in Firestore
      const snap = await getDocs(collection(db, 'stocks'));
      
      // 2. Determine which ones to DELETE (not in MOCK_STOCKS)
      const mockIds = MOCK_STOCKS.map(s => s.id);
      const toDelete = [];
      snap.forEach(doc => {
        if (!mockIds.includes(doc.id)) toDelete.push(doc.id);
      });

      console.log(`[Firestore] Found ${toDelete.length} companies to remove:`, toDelete);

      // 3. Delete foreign companies
      for (const id of toDelete) {
        await runTransaction(db, async (tx) => {
          tx.delete(doc(db, 'stocks', id));
        });
      }

      // 5. MASTER LEADERBOARD RE-CALCULATION
      console.log('[Firestore] Recalculating Master Leaderboard...');
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const portfoliosSnap = await getDocs(collection(db, 'portfolios'));
        
        const stocksMap = {};
        snap.forEach(d => stocksMap[d.id] = d.data());

        const portfoliosMap = {};
        portfoliosSnap.forEach(d => portfoliosMap[d.id] = d.data().holdings || {});

        const leaderboardData = [];
        for (const userDoc of usersSnap.docs) {
          const uData = userDoc.data();
          const uid = userDoc.id;
          const holdings = portfoliosMap[uid] || {};
          
          let assetsValue = 0;
          Object.entries(holdings).forEach(([sid, h]) => {
              const stock = MOCK_STOCKS.find(s => s.id === sid);
              const price = stocksMap[sid]?.price || stock?.basePrice || 0;
              assetsValue += (h.qty || 0) * price;
          });

          const totalValue = (uData.balance || 0) + assetsValue;
          const finalValue = Number(totalValue.toFixed(2));
          
          leaderboardData.push({
            uid,
            username: uData.displayName || uData.username || "Investor",
            email: uData.email || "",
            portfolioValue: finalValue,
            rank: 0,
            rankChange: 'none'
          });

          // Sync the user document itself so it's ready for future real-time triggers
          if (uData.portfolioValue !== finalValue) {
            await setDoc(doc(db, 'users', uid), { portfolioValue: finalValue }, { merge: true });
          }
        }

        // Sort and Rank
        leaderboardData.sort((a, b) => b.portfolioValue - a.portfolioValue);
        const finalRanked = leaderboardData.map((user, idx) => ({ ...user, rank: idx + 1 }));

        await setDoc(doc(db, 'leaderboard', 'users_global'), {
          data: finalRanked,
          updatedAt: serverTimestamp()
        });
        console.log(`[Firestore] Leaderboard Synced: ${finalRanked.length} traders ranked.`);
      } catch (leaderError) {
        console.error('Leaderboard sync failed during forceSeed', leaderError);
      }
      
      console.log('[Firestore] Database Cleaned & Seeded!');
      await fetchStocks();
    } catch (e) {
      console.error('Exclusive Seed failed', e);
      throw e;
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
      confirmTrade, applyIPO, forceSeed, resetData, manipulatePrice,
      publishArticle, deleteArticle, articles, setArticles,
      STOCKS: MOCK_STOCKS
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
