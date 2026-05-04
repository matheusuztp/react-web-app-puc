import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcXgYYV5Dl9fZx5UA5Z4i6pg7yIIEOYjs",
  authDomain: "react-web-app-puc.firebaseapp.com",
  projectId: "react-web-app-puc",
  storageBucket: "react-web-app-puc.firebasestorage.app",
  messagingSenderId: "743886152657",
  appId: "1:743886152657:web:2d1f2ef9b7f6a3293fb6f0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
