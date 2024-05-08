// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyBC79dkYXtQ0s7R46g_q9XDFKLjlmhnwcA",
  authDomain: "emailpasswordlogin-dd179.firebaseapp.com",
  projectId: "emailpasswordlogin-dd179",
  storageBucket: "emailpasswordlogin-dd179.appspot.com",
  messagingSenderId: "800748185636",
  appId: "1:800748185636:web:c2a5092dcfc1dfaea990b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const database = getAuth(app);
export const auth = getAuth(app);
