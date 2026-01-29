
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBtyH9cZM36C2FWKuIIioNlF9bL6TfWsB0",
    authDomain: "inloop-a0f96.firebaseapp.com",
    projectId: "inloop-a0f96",
    storageBucket: "inloop-a0f96.firebasestorage.app",
    messagingSenderId: "878309690186",
    appId: "1:878309690186:web:5746bf8d85c95abd728fb3",
    measurementId: "G-6PNH3TSJ5Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const fs = getFirestore(app);

// 🔑 REQUIRED
await setPersistence(auth, browserLocalPersistence);

console.log("Firebase initialized");


