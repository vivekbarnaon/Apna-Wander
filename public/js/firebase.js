// Firebase Integration for client-side
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJL64Ivdw7-xxQ6g1gEJKRAz3Rfdg7qzs",
  authDomain: "apana-wander.firebaseapp.com",
  projectId: "apana-wander",
  storageBucket: "apana-wander.firebasestorage.app",
  messagingSenderId: "563059978656",
  appId: "1:563059978656:web:039fb2a4492157127db4c5",
  measurementId: "G-RH8BBHYC7Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
