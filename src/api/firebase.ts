import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiEwMOg0vHF1scEVWWZqdaA_cohRVlIj8",
  authDomain: "ss-ttt.firebaseapp.com",
  projectId: "ss-ttt",
  storageBucket: "ss-ttt.appspot.com",
  messagingSenderId: "387139336121",
  appId: "1:387139336121:web:9b4616c16148e3a964a868",
  measurementId: "G-SNHXR7Z7WK",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }; // Export the Firestore instance
