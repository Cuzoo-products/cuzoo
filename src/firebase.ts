import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDisLiX7F3b2whcpyIXnmaGS1huS9DISUY",
  authDomain: "cuzoo-backend.firebaseapp.com",
  projectId: "cuzoo-backend",
  storageBucket: "cuzoo-backend.appspot.com",
  messagingSenderId: "134641014957",
  appId: "1:134641014957:web:d59b12326f78586c5d0e24",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;
