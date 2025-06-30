

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // Add this import

const firebaseConfig = {
  apiKey: "AIzaSyA8At_kLbcMbjj7YJUs4ZQK0FBu2RP5enw",
  authDomain: "eventify-34a3b.firebaseapp.com",
  projectId: "eventify-34a3b",
  storageBucket: "eventify-34a3b.firebasestorage.app",
  messagingSenderId: "1000919212896",
  appId: "1:1000919212896:web:b88d519cc4e99692efb405"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Add this line

export default auth;
export const storage = getStorage();
export { db }; // Add this line to enable named import
