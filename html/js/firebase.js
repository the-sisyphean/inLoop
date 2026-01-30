import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyBtyH9cZM36C2FWKuIIioNlF9bL6TfWsB0",
    authDomain: "inloop-a0f96.firebaseapp.com",
    projectId: "inloop-a0f96",
    storageBucket: "inloop-a0f96.firebasestorage.app",
    messagingSenderId: "878309690186",
    appId: "1:878309690186:web:5746bf8d85c95abd728fb3",
    measurementId: "G-6PNH3TSJ5Q"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const fs = getFirestore(app);

console.log("Firebase initialized");

