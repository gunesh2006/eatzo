
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "eatzo-c1cee.firebaseapp.com",
  projectId: "eatzo-c1cee",
  storageBucket: "eatzo-c1cee.firebasestorage.app",
  messagingSenderId: "73522513754",
  appId: "1:73522513754:web:1d972979019b4959ed5563"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app);

export {app,auth};