const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

exports.processTrade = functions.https.onCall(async (data, context) => {
  // Check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in."
    );
  }

  const { stockId, type, quantity } = data;
  const userId = context.auth.uid;

  if (!stockId || !type || !quantity || quantity <= 0) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Invalid trade parameters."
    );
  }

  try {
    return await db.runTransaction(async (transaction) => {
      // 1. Fetch User Data
      const userRef = db.collection("users").doc(userId);
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) throw new Error("User not found.");
      const userData = userDoc.data();

      // 2. Fetch Stock Data
      const stockRef = db.collection("stocks").doc(stockId);
      const stockDoc = await transaction.get(stockRef);
      if (!stockDoc.exists) throw new Error("Stock not found.");
      const stockData = stockDoc.data();
      const currentPrice = stockData.price;

      // 3. Fetch Portfolio Data
      const portfolioRef = db.collection("portfolio").doc(userId);
      const portfolioDoc = await transaction.get(portfolioRef);
      let portfolio = portfolioDoc.exists ? portfolioDoc.data().holdings || {} : {};

      const totalCost = currentPrice * quantity;
      let newBalance = userData.balance;
      let newPrice = currentPrice;
      let stockQuantityInPortfolio = portfolio[stockId] ? portfolio[stockId].quantity : 0;

      if (type === "buy") {
        if (userData.balance < totalCost) {
          throw new Error("Insufficient balance.");
        }
        newBalance -= totalCost;
        stockQuantityInPortfolio += quantity;
        newPrice += quantity * 0.5;
      } else if (type === "sell") {
        if (stockQuantityInPortfolio < quantity) {
          throw new Error("Insufficient stock quantity.");
        }
        newBalance += totalCost;
        stockQuantityInPortfolio -= quantity;
        newPrice -= (quantity * 0.5);
        if (newPrice < 0) newPrice = 0.01; // Floor price
      } else {
        throw new Error("Invalid trade type.");
      }

      // 4. Update Database
      // New trade record
      const tradeRef = db.collection("trades").doc();
      transaction.set(tradeRef, {
        userId,
        stockId,
        type,
        quantity,
        price: currentPrice,
        total: totalCost,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Update User Balance
      transaction.update(userRef, { balance: newBalance });

      // Update Portfolio
      portfolio[stockId] = {
        stockId,
        quantity: stockQuantityInPortfolio,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      transaction.set(portfolioRef, { holdings: portfolio }, { merge: true });

      // Update Stock Price
      transaction.update(stockRef, { price: newPrice });

      // Add to Price History
      const historyRef = stockRef.collection("price_history").doc();
      transaction.set(historyRef, {
        price: newPrice,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return { success: true, newBalance, newPrice };
    });
  } catch (error) {
    console.error("Trade transaction failed: ", error);
    return { success: false, error: error.message };
  }
});

exports.seedData = functions.https.onCall(async (data, context) => {
  const stocks = [
    { id: 'msft', name: 'Microsoft', ticker: 'MSFT', price: 420, sector: 'IT', desc: 'Microsoft Corporation is an American multinational technology company.' },
    { id: 'aapl', name: 'Apple Inc', ticker: 'AAPL', price: 198, sector: 'IT', desc: 'Apple Inc. is an American multinational technology company.' },
    { id: 'reliance', name: 'Reliance', ticker: 'RIL', price: 2890, sector: 'Energy', desc: 'Reliance Industries Limited is an Indian multinational conglomerate.' },
    { id: 'tcs', name: 'TCS', ticker: 'TCS', price: 3520, sector: 'IT', desc: 'Tata Consultancy Services is an Indian multinational IT services company.' }
  ];

  const batch = db.batch();

  stocks.forEach(s => {
    const ref = db.collection('stocks').doc(s.id);
    batch.set(ref, { 
      ...s, 
      prevPrice: s.price, 
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp() 
    });

    // Initial history point
    const hRef = ref.collection('price_history').doc();
    batch.set(hRef, { price: s.price, createdAt: admin.firestore.FieldValue.serverTimestamp() });
  });

  // Sample posts
  const posts = [
    { title: 'Why Microsoft is a buy', content: 'Cloud growth is strong...', createdAt: admin.firestore.FieldValue.serverTimestamp(), likeCount: 0, commentCount: 0, userId: 'system' },
    { title: 'Apple earnings outlook', content: 'Upcoming iPhone sales...', createdAt: admin.firestore.FieldValue.serverTimestamp(), likeCount: 0, commentCount: 0, userId: 'system' }
  ];

  posts.forEach(p => {
    const ref = db.collection('posts').doc();
    batch.set(ref, p);
  });

  await batch.commit();
  return { success: true };
});
exports.marketAnalysis = functions.pubsub.schedule("* * * * *").onRun(async (context) => {
  const stocksSnapshot = await db.collection("stocks").get();
  
  for (const stockDoc of stocksSnapshot.docs) {
    const stock = stockDoc.data();
    const currentPrice = stock.price;
    const prevPrice = stock.prevPrice;

    if (!prevPrice || currentPrice === prevPrice) continue;

    const changePercent = ((currentPrice - prevPrice) / prevPrice) * 100;
    const type = changePercent >= 2 ? "bullish" : changePercent <= -2 ? "bearish" : null;

    if (type) {
      const changeStr = (changePercent >= 0 ? "+" : "") + changePercent.toFixed(2) + "%";
      
      // 1. Create News Entry
      await db.collection("news").add({
        title: `${stock.name} is ${type === "bullish" ? "booming 🚀" : "dropping ⚠️"}`,
        description: `${stock.ticker} ${type === "bullish" ? "gained" : "lost"} ${changeStr} in the last minute.`,
        stock: stock.ticker,
        type: type,
        change: changeStr,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      // 2. Send Global Notification
      const topicMessage = {
        notification: {
          title: `Market Alert: ${stock.ticker}`,
          body: `${stock.name} is ${type} (${changeStr})`
        },
        topic: "market_updates"
      };
      await admin.messaging().send(topicMessage).catch(e => console.error("Global FCM Error", e));

      // 3. Find Owners for Personal Alerts
      const portfoliosSnapshot = await db.collection("portfolio").get();
      for (const pDoc of portfoliosSnapshot.docs) {
        const holdings = pDoc.data().holdings || {};
        if (holdings[stockDoc.id] && holdings[stockDoc.id].quantity > 0) {
          const userId = pDoc.id;
          const userDoc = await db.collection("users").doc(userId).get();
          const fcmToken = userDoc.data()?.fcmToken;

          if (fcmToken) {
            const personalMessage = {
              notification: {
                title: `📈 Your Stock Update`,
                body: `${stock.ticker} in your portfolio moved ${changeStr}`,
              },
              token: fcmToken
            };
            await admin.messaging().send(personalMessage).catch(e => console.error("Personal FCM Error", e));
          }
        }
      }
    }

    // UPDATE PREVPRICE (Crucial for next 1-min cycle)
    await stockDoc.ref.update({ prevPrice: currentPrice });
  }
  return null;
});

/* DISABLED AUTOMATED PRICE ENGINE - ONLY TRADES MOVE PRICES NOW
exports.updateStockPrices = functions.pubsub.schedule("* * * * *").onRun(async (context) => {
  const snapshot = await db.collection("stocks").get();
  const batch = db.batch();

  const now = Date.now();
  snapshot.forEach(doc => {
    const data = doc.data();
    let currentPrice = data.price || 100;
    
    const lastUpdate = data.lastUpdated ? data.lastUpdated.toMillis() : 0;
    if (now - lastUpdate < 60000) return;

    const changePercent = (Math.random() * 3 - 1.5);
    const newPrice = currentPrice + (currentPrice * changePercent / 100);

    batch.update(doc.ref, {
      prevPrice: currentPrice,
      price: Number(newPrice.toFixed(2)),
      lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  await batch.commit();
  console.log("Market prices updated with realistic fluctuation.");
  return null;
});
*/

// ENHANCED: LEADERBOARD SYSTEM (REALTIME RANKING)
exports.updateLeaderboard = functions.pubsub.schedule("* * * * *").onRun(async (context) => {
  const snapshot = await db.collection("stocks").get();
  const stocks = [];

  snapshot.forEach(doc => {
    const data = doc.data();
    if (!data.price) return;
    
    // Provide a default change of 0% if prevPrice is missing during initial seed
    const prevPrice = data.prevPrice || data.price;
    const change = ((data.price - prevPrice) / prevPrice) * 100;

    stocks.push({
      id: doc.id,
      symbol: data.ticker || data.symbol,
      name: data.name,
      price: data.price,
      change: Number(change.toFixed(2))
    });
  });

  const topGainers = [...stocks].sort((a, b) => b.change - a.change).slice(0, 5);
  const topLosers = [...stocks].sort((a, b) => a.change - b.change).slice(0, 5);

  await db.collection("leaderboard").doc("global").set({
    topGainers,
    topLosers,
    lastUpdated: admin.firestore.FieldValue.serverTimestamp()
  });

  return null;
});
