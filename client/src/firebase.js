// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "bilgin-estate.firebaseapp.com",
  projectId: "bilgin-estate",
  storageBucket: "bilgin-estate.appspot.com",
  messagingSenderId: "163982046063",
  appId: "1:163982046063:web:9bb967fc1b934d324dee9a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
