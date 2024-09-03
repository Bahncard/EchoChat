import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,

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