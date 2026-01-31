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
import { doc,query,where, getDoc,getDocs, updateDoc, setDoc, serverTimestamp, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";




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
    
  } else {
    createBtn.classList.add('hidden');
    
  }

  loadClubs();
});


const createClub = document.querySelector("#createClub");



console.log("🔥 createClub.js loaded");
createClub.addEventListener("click", async (e) => {
  e.preventDefault();

  

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
      field: document.getElementById("clubTag").value.toLowerCase(), 
      createdBy: auth.currentUser.email,
      createdAt: new Date()
    });

    alert("✅ Club created successfully!");
    createclubform.classList.add('hidden');
    clubs.classList.remove('hidden');
    clubfooter.classList.remove('hidden');
    // loadClubs();
    loadClubs("all");

  } catch (err) {
    console.error(err);
    alert(err.code);
  }
});

//load clubs


const clubsRef = collection(fs, "clubs");
const clubsContainer = document.getElementById("clubsContainer");

// async function loadClubs(category = "All") {
//   clubsContainer.innerHTML = "";

//   let q = clubsRef;
//   if (category !== "All") {
//     q = query(clubsRef, where("category", "==", category));
//   }

//   const snapshot = await getDocs(q);

//   snapshot.forEach(doc => {
//     const club = doc.data();
//     clubsContainer.innerHTML += clubCard(club);
//   });
// }
// async function loadClubs(field = "all") {
//   clubsContainer.innerHTML = "";

//   let q = clubsRef;

//   if (field !== "all") {
//     q = query(clubsRef, where("field", "==", field));
//   }

//   const snapshot = await getDocs(q);

//   snapshot.forEach(doc => {
//     const club = doc.data();
//     clubsContainer.innerHTML += clubCard(club);
//   });
// }


let allClubs = [];
async function loadClubs(field = "all") {
  clubsContainer.innerHTML = "";
  allClubs = [];

  let q = clubsRef;

  if (field !== "all") {
    q = query(clubsRef, where("field", "==", field));
  }

  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    allClubs.push({
      id: docSnap.id,
      ...docSnap.data()
    });
  });

  renderClubs(allClubs);
}


function getFieldMeta(field) {
  const f = field;

  if (f.includes("tech")|| f.includes("Tech")) {
    return { icon: "fas fa-laptop-code", color: "#3B82F6", background: "linear-gradient(135deg, #3B82F6 0%, #1E40AF 100%) "};
  }
  if (f.includes("cultural")|| f.includes("Cultural")) {
    return { icon: "fas fa-palette", color: "#EC4899",background: "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)"  };
  }
  if (f.includes("sports")|| f.includes("Sports")) {
    return { icon: "fas fa-running", color: "#10B981",background: "linear-gradient(135deg, #10B981 0%, #059669 100%)" };
  }
  if (f.includes("fest")||f.includes("Fest")) {
    return { icon: "fas fa-star", color: " #F59E0B", background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" };
  }
  // if (f.includes("dance")) {
  //   return { icon: "fa-person-walking", color: "#F97316" };
  // }
  // if (f.includes("sports")) {
  //   return { icon: "fa-football", color: "#22C55E" };
  // }
  // if (f.includes("literary") || f.includes("debate")) {
  //   return { icon: "fa-book", color: "#F59E0B" };
  // }

  // default
  // return { icon: "fa-users", color: "#6B7280" };
}



const chips = document.querySelectorAll(".chip");

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");

    const field = chip.dataset.field;
    loadClubs(field);
  });
});


function clubCard(club) {
  const meta = getFieldMeta(club.field);
  const isAdmin =
    auth.currentUser &&
    club.createdBy === auth.currentUser.email;

  return `
    <a href="club-detail.html" style="text-decoration: none;">
      <div class="club-card">
      ${isAdmin ? `<span class="admin-badge">Admin</span>` : ""}
      
        <div class="club-banner"
          style="background: ${meta.background};">
          
          <div class="club-logo">
            <i class="fas ${meta.icon}" style="color: ${meta.color};"></i>
          </div>
        </div>
        
        <div class="club-card-body">
          <h3 class="club-card-title">${club.name}</h3>
          <span class="badge badge-tech">
            <i class="fas ${meta.icon}"></i> ${club.field}
          </span>
          <br>
          <br>
          <p class="club-description">
            ${club.description}
          </p>
          <hr>
        </div>
      </div>
    </a>
  `;
  console.log("checked");
}

// let allClubs = [];
// allClubs = [];

// querySnapshot.forEach((docSnap) => {
//   const club = { id: docSnap.id, ...docSnap.data() };
//   allClubs.push(club);
// });

// renderClubs(allClubs);
// function renderClubs(clubs) {
//   clubsContainer.innerHTML = "";

//   if (clubs.length === 0) {
//     clubsContainer.innerHTML = "<p>No clubs found</p>";
//     return;
//   }

//   clubs.forEach((club) => {
//     createClub(club); // your existing card function
//   });
// }
// const searchInput = document.getElementById("clubSearchInput");

// searchInput.addEventListener("input", () => {
//   const value = searchInput.value.toLowerCase().trim();

//   const filtered = allClubs.filter((club) =>
//     club.name.toLowerCase().includes(value) ||
//     club.field.toLowerCase().includes(value)
//   );

//   renderClubs(filtered);
// });


function renderClubs(clubs) {
  clubsContainer.innerHTML = "";

  if (clubs.length === 0) {
    clubsContainer.innerHTML = "<p>No clubs found</p>";
    return;
  }

  clubs.forEach((club) => {
    clubsContainer.innerHTML += clubCard(club);
  });
}
const searchInput = document.getElementById("clubSearchInput");

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase().trim();

  const filtered = allClubs.filter((club) =>
    club.name.toLowerCase().includes(value) ||
    club.field.toLowerCase().includes(value)
  );

  renderClubs(filtered);
});
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const field = btn.dataset.field; // tech, cultural, sports, all
    loadClubs(field);
  });
});
