import { auth, fs } from "./firebase.js";
import {
  
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,

  signOut
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const updatebtn = document.querySelector("#updatebtn");
const currentPassword = document.querySelector("#currentPassword");
const newPassword = document.querySelector("#newPassword")

updatebtn.addEventListener("click", async () => {
  const user = auth.currentUser;

  if (!user) {
    alert("Not logged in");
    return;
  }

  if (!currentPassword.value || !newPassword.value) {
    alert("Fill all fields");
    return;
  }

  try {
    // 🔐 Re-authentication (required by Firebase)
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword.value
    );

    await reauthenticateWithCredential(user, credential);

    // 🔁 Update password
    await updatePassword(user, newPassword.value);

    alert("Password updated successfully ✅");
    window.location.href = "home.html"

    // // Reset UI
    // passwordBox.style.display = "none";
    // currentPassword.value = "";
    // newPassword.value = "";

  } catch (error) {
    console.error(error);

    if (error.code === "auth/wrong-password") {
      alert("Current password is incorrect");
    } else if (error.code === "auth/weak-password") {
      alert("Password should be at least 6 characters");
    } else {
      alert(error.message);
    }
  }
});