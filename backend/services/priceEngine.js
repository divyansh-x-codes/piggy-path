const { db } = require('../firebaseAdmin');
const { getIO } = require('../sockets/index');

/**
 * GLOBAL PRICE ENGINE
 * Fluctuates stock prices every 2 seconds and broadcasts to all users.
 */
const startPriceEngine = () => {
    console.log('[PriceEngine] Passive Monitor Active - Automated Fluctuations Disabled');

    setInterval(async () => {
        try {
            const stocksRef = db.collection('stocks');
            const snapshot = await stocksRef.get();
            if (snapshot.empty) return;

            const batch = db.batch();

            snapshot.forEach(doc => {
                const data = doc.data();
                const currentPrice = parseFloat(data.price || data.basePrice || 100);
                
                // ─── USER REQUESTED LOGIC (2% Volatility) ───
                const fluctuation = (Math.random() - 0.5) * 0.02;
                const newPrice = +(currentPrice * (1 + fluctuation)).toFixed(2);
                
                let history = data.history || [];
                // Keep last 50 points as requested
                history = [...history.slice(-49), newPrice];

                batch.update(doc.ref, {
                    price: newPrice,
                    history: history,
                    lastUpdated: new Date()
                });
            });

            await batch.commit();
        } catch (err) {
            console.error('[PriceEngine] Error:', err.message);
        }
    }, 2000);
};

module.exports = { startPriceEngine };
