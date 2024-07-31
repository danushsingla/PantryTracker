// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe27_DkUBhYye8IvQK7yCo5AIgA8gZnYI",
  authDomain: "pantrytracker-8e442.firebaseapp.com",
  projectId: "pantrytracker-8e442",
  storageBucket: "pantrytracker-8e442.appspot.com",
  messagingSenderId: "85768074026",
  appId: "1:85768074026:web:a1b0716a04366c3d196453"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {app, firestore}