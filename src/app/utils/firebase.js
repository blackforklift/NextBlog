// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE,
  authDomain: "blogg-d2a32.firebaseapp.com",
  projectId: "blogg-d2a32",
  storageBucket: "blogg-d2a32.appspot.com",
  messagingSenderId: "128527258088",
  appId: "1:128527258088:web:3036a4da429f21bb20545d",
  measurementId: "G-68XTZ2SFZD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
