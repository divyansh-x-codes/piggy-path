import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Config restored from your screenshots. 
// NOTE: If you still see "api-key-not-valid", please go to Firebase Console -> Project Settings -> General 
// and copy the "apiKey" exactly from your Web App settings.
const firebaseConfig = {
  apiKey: "AIzaSyCkEu2YMscVqLBsWy1QnWduirHmjJJwTW0", // Check this in Firebase Console if error continues
  authDomain: "piggypath-eaaff.firebaseapp.com",
  projectId: "piggypath-eaaff",
  storageBucket: "piggypath-eaaff.appspot.com", // Updated as requested
  messagingSenderId: "255204375741",
  appId: "1:255204375741:web:473bae5a368c49c4918bd4",
  measurementId: "G-YNH54ZTW30"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Restored! Necessary for portfolio and trading
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export { auth, db, analytics };