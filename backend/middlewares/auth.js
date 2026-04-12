const { admin } = require('../firebase/admin');
const { prisma } = require('../prisma/client');

/**
 * Middleware: Verifies Firebase ID Token from Authorization header
 * Attaches req.user = { firebaseUid, email, phone, name, dbUser }
 */
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header. Expected: Bearer <token>' });
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify token with Firebase Admin
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (firebaseErr) {
      console.error('[Auth] Firebase token verification failed:', firebaseErr.message);
      return res.status(401).json({ error: 'Invalid or expired Firebase token' });
    }

    const { uid, email, phone_number, name, picture } = decodedToken;

    // Find or create user in our DB
    let dbUser = await prisma.user.findUnique({ where: { firebaseUid: uid } });

    if (!dbUser) {
      // New user — create record
      const displayName = name || (email ? email.split('@')[0] : 'Trader');
      dbUser = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email: email || null,
          phone: phone_number || null,
          name: displayName,
          balance: 100000,
        },
      });
      console.log(`[Auth] New user created: ${dbUser.name} (${dbUser.id})`);
    }

    // Attach to request
    req.user = {
      firebaseUid: uid,
      email,
      phone: phone_number,
      dbUser,
    };

    next();
  } catch (err) {
    console.error('[Auth] Unexpected error in verifyFirebaseToken:', err);
    res.status(500).json({ error: 'Internal auth error' });
  }
};

module.exports = { verifyFirebaseToken };
