import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "chat-app-bahncard.firebaseapp.com",
  projectId: "chat-app-bahncard",
  storageBucket: "chat-app-bahncard.appspot.com",
  messagingSenderId: "35879670832",
  appId: "1:35879670832:web:114e2a209622e6565f89f5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initailize Firestore
export const db = getFirestore(app);
// export const db = initializeFirestore(app, {
//   experimentalForceLongPolling: true
// });
 
console.log("Firebase initialized successfully");

export const auth = getAuth();

//validate 
if (db) {
  console.log("Firestore instance created successfully:", db);
  console.log("Firestore instance ID:", db._databaseId.projectId);
} else {
  console.error("Failed to create Firestore instance");
}

export const storage = getStorage();