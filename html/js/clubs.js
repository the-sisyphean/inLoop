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
import { doc, getDoc, updateDoc, setDoc, serverTimestamp, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";




// document.addEventListener("DOMContentLoaded", () => {
//   // Filter chips
//   const filterChips = document.querySelectorAll(".filter-chips .chip");
//   const clubCards = document.querySelectorAll(".club-card");

//   // Helper: get category from badge text
//   function getClubCategory(card) {
//     const badge = card.querySelector(".badge");
//     if (!badge) return "all";
//     return badge.textContent.toLowerCase();
//   }

//   // Filter logic
//   filterChips.forEach(chip => {
//     chip.addEventListener("click", () => {
//       // Remove active from all chips
//       filterChips.forEach(c => c.classList.remove("active"));
//       chip.classList.add("active");

//       const filter = chip.textContent.toLowerCase().trim();

//       clubCards.forEach(card => {
//         const category = getClubCategory(card);

//         if (filter === "all" || category.includes(filter)) {
//           card.style.display = "block";
//         } else {
//           card.style.display = "none";
//         }
//       });
//     });
//   });

//   // Club card navigation (pass club id)
//   clubCards.forEach(card => {
//     card.addEventListener("click", () => {
//       const clubName = card.querySelector(".club-card-title").textContent;
//       const clubId = clubName.toLowerCase().replace(/\s+/g, "-");

//       window.location.href = `club-detail.html?club=${clubId}`;
//     });
//   });
// });


const createclubform = document.querySelector("#createclubform");
const createBtn = document.querySelector("#createClubBtn")
const clubs = document.querySelector("#clubs");
const clubfooter = document.querySelector("#club-bottom")
const createClubBtn = document.querySelector("#createClubBtn");
const form = document.querySelector("#form");

createClubBtn.addEventListener("click", () => {
  createclubform.classList.remove('hidden');
  clubs.classList.add('hidden');
  clubfooter.classList.add('hidden');
})

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    return;
  }

  const adminRef = doc(fs, "clubAdmins", user.email);
  const adminSnap = await getDoc(adminRef);

  if (adminSnap.exists()) {
    createBtn.classList.remove('hidden');
    console.log("admin came")
  } else {
    createBtn.classList.add('hidden');
    console.log("user came")
  }
});


const createClub = document.querySelector("#createClub");



console.log("🔥 createClub.js loaded");
createClub.addEventListener("click", async (e) => {
  e.preventDefault();

  console.log("✅ submit intercepted");

  if (!auth.currentUser) {
    alert("Not logged in");
    return;
  }

  if (!form.checkValidity()) {
    form.reportValidity(); // shows browser validation UI
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
    createclubform.classList.add('hidden');
    clubs.classList.remove('hidden');
    clubfooter.classList.remove('hidden');

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
