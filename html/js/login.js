import { auth, fs } from "./firebase.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

await setPersistence(auth, browserLocalPersistence);

const allowedDomain = ".iitr.ac.in"; 
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const loginBtn = document.querySelector("#loginBtn");

loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!email.value.endsWith(".iitr.ac.in")) {
    alert("Only college email IDs allowed");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      email.value.trim(),
      password.value.trim()
    );

    console.log(fs);

    await setDoc(doc(fs, "users", cred.user.uid), {
      email: cred.user.email,
      createdAt: serverTimestamp()
    });

    alert("Logged in successfully!");
    window.location.href = "home.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }

  
});
