import { auth, fs } from "./firebase.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
}
  from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
import { doc, getDoc, updateDoc, setDoc, getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";


const allowedDomain = "@college.edu"; // change this
