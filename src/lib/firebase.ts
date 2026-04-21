import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDMsji4BPEwXVb-VmmPniNPOqF-e2P6kcE",
  authDomain: "timewise-69e11.firebaseapp.com",
  projectId: "timewise-69e11",
  storageBucket: "timewise-69e11.firebasestorage.app",
  messagingSenderId: "803914032361",
  appId: "1:803914032361:web:1cbff90cc94ff2373abc78",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
