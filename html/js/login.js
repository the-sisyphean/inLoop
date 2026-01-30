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

const allowedDomain = ".iitr.ac.in"; // change this
const loginemail = document.querySelector("#email");
const loginpassword = document.querySelector("#password");
const loginBtn = document.querySelector("#loginBtn");
const signupemail = document.querySelector("#signupemail");
const signuppassword = document.querySelector("#signuppassword");
const confirmpassword = document.querySelector("#confirmpassword");
const signupBtn = document.querySelector("#signupBtn");
const showsignup = document.querySelector("#showsignup");
const signupform = document.querySelector("#signupform");
const loginform = document.querySelector("#loginform");


showsignup.addEventListener("click", () => {
  signupform.classList.remove('hidden');
  loginform.classList.add('hidden');
})

//signup
signupBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  if (!signupemail.value.endsWith(".iitr.ac.in")) {
    alert("Only college email IDs allowed");
    return;
  }

  if (signuppassword.value !== confirmpassword.value) {
    alert("Passwords do not match");
    return;
  }

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      signupemail.value.trim(),
      signuppassword.value.trim()
    );

    console.log(fs);

    await setDoc(doc(fs, "users", cred.user.uid), {
      email: cred.user.email,
      createdAt: serverTimestamp()
    });

    alert("Account Created 🎉");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert(err.message);
  }

  
});


//sign in
loginBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    // // 🔸 Remember Me
    // const persistence = rememberMe.checked
    //   ? browserLocalPersistence
    //   : browserSessionPersistence;

    // await setPersistence(auth, persistence);

    //     // 🔹 Sign in
    await signInWithEmailAndPassword(
      auth,
      loginemail.value,
      loginpassword.value
    );

    alert("Login successful ✅");
    window.location.href = "home.html";

  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});

