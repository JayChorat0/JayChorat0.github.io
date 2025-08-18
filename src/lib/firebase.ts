
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "cyber-sleuth-2lw00",
  "appId": "1:218425118218:web:4511fbf82c611feabb99f3",
  "storageBucket": "cyber-sleuth-2lw00.firebasestorage.app",
  "apiKey": "AIzaSyAQ2_9rOMbp3hpoPUJHTGAthzYFjF4FRvo",
  "authDomain": "cyber-sleuth-2lw00.firebaseapp.com",
  "messagingSenderId": "218425118218",
  "measurementId": "G-4PNRXQWJ8P"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
