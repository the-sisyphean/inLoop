import { auth, fs, db } from "./firebase.js";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendEmailVerification,

  signOut
}
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import { getFirestore, getDocs,query,where, doc, getDoc, updateDoc, setDoc, serverTimestamp,collection,addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const createClub = document.querySelector("#createClub");



console.log("🔥 createClub.js loaded");
createClub.addEventListener("click", async (e) => {
  e.preventDefault();

  console.log("✅ submit intercepted");

  if (!auth.currentUser) {
    alert("Not logged in");
    return;
  }

  try {
    await addDoc(collection(fs, "clubs"), {
      name: document.getElementById("clubName").value,
      description: document.getElementById("clubDesc").value,
      field: document.getElementById("clubTag").value,
      createdBy: auth.currentUser.email,
      createdAt: new Date()
    });

    alert("✅ Club created successfully!");
    

  } catch (err) {
    console.error(err);
    alert(err.code);
  }
});

//load clubs


const clubsRef = collection(fs, "clubs");
const clubsContainer = document.getElementById("clubsContainer");

async function loadClubs(category = "All") {
  clubsContainer.innerHTML = "";

  let q = clubsRef;
  if (category !== "All") {
    q = query(clubsRef, where("category", "==", category));
  }

  const snapshot = await getDocs(q);

  snapshot.forEach(doc => {
    const club = doc.data();
    clubsContainer.innerHTML += clubCard(club);
  });
}
function clubCard(club) {
  return `
    <div class="club-card">
      <div class="club-header ${club.category.toLowerCase()}">
        <div class="club-icon">${club.icon || "🏫"}</div>
      </div>

      <div class="club-body">
        <h3>${club.name}</h3>

        <span class="badge ${club.category.toLowerCase()}">
          ${club.category}
        </span>

        <p>${club.description}</p>

        
      </div>
    </div>
  `;
}
