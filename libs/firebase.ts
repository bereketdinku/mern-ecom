// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQOSnjXNQ59Ai9XqHppigAMfg46MQv1Qs",
  authDomain: "mern-22948.firebaseapp.com",
  projectId: "mern-22948",
  storageBucket: "mern-22948.appspot.com",
  messagingSenderId: "518662082496",
  appId: "1:518662082496:web:a085011730664dfd3b0225",
  measurementId: "G-Q0TW7EX0S2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app