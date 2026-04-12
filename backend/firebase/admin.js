const admin = require('firebase-admin');
const path = require('path');

let firebaseInitialized = false;

const initializeFirebase = () => {
  if (firebaseInitialized) return;

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (!serviceAccountPath) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_PATH is not set in .env');
    }

    const absolutePath = path.resolve(serviceAccountPath);
    const serviceAccount = require(absolutePath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    firebaseInitialized = true;
    console.log('[Firebase Admin] Initialized successfully');
  } catch (err) {
    console.error('[Firebase Admin] Initialization failed:', err.message);
    console.error('Make sure you have placed your serviceAccountKey.json at:');
    console.error('  backend/firebase/serviceAccountKey.json');
    console.error('And set FIREBASE_SERVICE_ACCOUNT_PATH in your .env file');
    process.exit(1);
  }
};

module.exports = { admin, initializeFirebase };
