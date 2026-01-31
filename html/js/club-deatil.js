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
import { doc,query,where, getDoc,getDocs, updateDoc, setDoc, serverTimestamp, collection, addDoc,  orderBy } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
// document.addEventListener("DOMContentLoaded", () => {
//   console.log("club-detail.js loaded");

//   // ----- TAB BUTTONS -----
//   const tabs = {
//     posts: document.querySelector('[data-testid="tab-posts"]'),
//     resources: document.querySelector('[data-testid="tab-resources"]'),
//     calendar: document.querySelector('[data-testid="tab-calendar"]'),
//     members: document.querySelector('[data-testid="tab-members"]')
//   };

//   // ----- TAB SECTIONS -----
//   const sections = {
//     posts: document.getElementById("posts-section"),
//     resources: document.getElementById("resources-section"),
//     calendar: document.getElementById("calendar-section"),
//     members: document.getElementById("members-section")
//   };

//   // ----- SAFETY CHECK -----
//   for (const key in tabs) {
//     if (!tabs[key] || !sections[key]) {
//       console.error(`Missing tab or section: ${key}`);
//       return;
//     }
//   }

//   // ----- TAB SWITCH FUNCTION -----
//   function showSection(active) {
//     Object.values(sections).forEach(section => {
//       section.style.display = "none";
//     });

//     Object.values(tabs).forEach(tab => {
//       tab.classList.remove("active");
//     });

//     sections[active].style.display = "block";
//     tabs[active].classList.add("active");
//   }

//   // ----- CLICK HANDLERS -----
//   tabs.posts.addEventListener("click", () => showSection("posts"));
//   tabs.resources.addEventListener("click", () => showSection("resources"));
//   tabs.calendar.addEventListener("click", () => showSection("calendar"));
//   tabs.members.addEventListener("click", () => showSection("members"));

//   // ----- DEFAULT VIEW -----
//   showSection("posts");

//   // ----- READ CLUB FROM URL (for later Firebase use) -----
//   const params = new URLSearchParams(window.location.search);
//   const clubId = params.get("club") || "coding-club";

//   console.log("Viewing club:", clubId);
// });
const adminaccess = document.querySelector("#adminaccess");
const adminmenu = document.querySelector("#adminmenu")

adminmenu.addEventListener("click", () => {
  adminaccess.classList.toggle('hidden');

})
const monthLabel = document.getElementById("monthLabel");
const calendarDays = document.getElementById("calendarDays");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const todayBtn = document.getElementById("todayBtn");
const createPostBtn = document.querySelector("#createPostBtn");
const clubdetailheader = document.querySelector(".club-detail-header")
const headingposts =  document.querySelector("#headingposts")
const Cancel = document.querySelector("#Cancel");


// createPostBtn.addEventListener("click", () => {
//   createPostForm.classList.remove('hidden');
//   postsContainer.classList.add('hidden');
//   clubdetailheader.classList.add('hidden');
//   headingposts.classList.add('hidden');
// })


// Cancel.addEventListener("click", () => {
//   createPostForm.classList.add('hidden');
//   postsContainer.classList.remove('hidden');
//   clubdetailheader.classList.remove('hidden');
//   headingposts.classList.remove('hidden');
// })


// createPostBtn.style.display = "none";
// addEventBtn.style.display = "none";

/* ------------------ ADMIN CHECK ------------------ */
onAuthStateChanged(auth, async (user) => {
  if (!user) return;

  try {
    const adminRef = doc(fs, "clubAdmins", user.email);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) return;

    const adminData = adminSnap.data();

    if (adminData.clubs && adminData.clubs.includes(clubId)) {
      // ✅ user is admin of this club
      createPostBtn.style.display = "inline-block";
      addEventBtn.style.display = "inline-block";
    }
  } catch (err) {
    console.error(err);
  }
});



const eventPanel = document.getElementById("eventPanel");
const eventList = document.getElementById("eventList");
const eventDateTitle = document.getElementById("eventDateTitle");

// 🔹 Temporary events (later from Firebase)
const events = {
  "2026-01-05": [
    { title: "DSA Practice Session", time: "6:00 PM", location: "Lab A" }
  ],
  "2026-01-15": [
    { title: "Hackathon Kickoff", time: "10:00 AM", location: "Auditorium" },
    { title: "Team Formation", time: "2:00 PM", location: "Online" }
  ]
};

let currentDate = new Date();

function renderCalendar() {
  calendarDays.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month label
  monthLabel.textContent = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  /* ---------- Previous month fillers ---------- */
  if (firstDay !== 0) {
    const prevLastDate = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const div = document.createElement("div");
      div.className = "day other-month";
      div.innerHTML = `<span class="day-number">${prevLastDate - i}</span>`;
      calendarDays.appendChild(div);
    }
  }

  /* ---------- Current month days ---------- */
  for (let day = 1; day <= lastDate; day++) {
    const div = document.createElement("div");
    div.className = "day";

    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    div.dataset.date = dateKey;

    // Today highlight
    const today = new Date();
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      div.classList.add("today");
    }

    div.innerHTML = `<span class="day-number">${day}</span>`;

    // 🔥 CLICK HANDLER (IMPORTANT)
    div.addEventListener("click", () => showEvents(dateKey));

    calendarDays.appendChild(div);
  }

  /* ---------- Next month fillers ---------- */
  const remainder = calendarDays.children.length % 7;
  if (remainder !== 0) {
    for (let i = 1; i <= 7 - remainder; i++) {
      const div = document.createElement("div");
      div.className = "day other-month";
      div.innerHTML = `<span class="day-number">${i}</span>`;
      calendarDays.appendChild(div);
    }
  }
}

function showEvents(dateKey) {
  eventDateTitle.textContent = `Events on ${dateKey}`;
  eventList.innerHTML = "";

  const dayEvents = events[dateKey];

  if (!dayEvents || dayEvents.length === 0) {
    eventList.innerHTML = "<p>No events for this day</p>";
    return;
  }

  dayEvents.forEach(ev => {
    const div = document.createElement("div");
    div.className = "event-card";
    div.innerHTML = `
      <h4>${ev.title}</h4>
      <div class="event-meta">${ev.time} • ${ev.location}</div>
    `;
    eventList.appendChild(div);
  });
}

/* ---------- Navigation ---------- */
prevBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
};

nextBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
};

todayBtn.onclick = () => {
  currentDate = new Date();
  renderCalendar();
};

renderCalendar();


// const clubActions = document.getElementById("clubActions");

// onAuthStateChanged(auth, async (user) => {
//   if (!user) {
//     clubActions.style.display = "none";
//     return;
//   }

//   const adminRef = doc(db, "clubAdmins", user.email);
//   const adminSnap = await getDoc(adminRef);

//   if (adminSnap.exists()) {
//     clubActions.style.display = "flex";
//   } else {
//     clubActions.style.display = "none";
//   }
// });
// document.getElementById("createPostBtn").onclick = () => {
//   window.location.href = "c";
// };

// document.getElementById("addEventBtn").onclick = () => {
//   window.location.href = "add-event.html";
// };

/* -------------------- GET CLUB ID -------------------- */
// const params = new URLSearchParams(window.location.search);
// const clubId = params.get("id");

// // if (!clubId) {
// //   console.error("Club ID missing in URL");
// //   alert("Invalid club link");
// //   throw new Error("Club ID missing in URL");
// // }

// /* -------------------- ELEMENTS -------------------- */
// const createPostForm = document.getElementById("createPostForm");
// const postsContainer = document.getElementById("postsContainer");

// /* -------------------- CREATE POST -------------------- */
// createPostForm.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   if (!auth.currentUser) {
//     alert("Login required");
//     return;
//   }

//   const title = document.getElementById("postTitle").value.trim();
//   const content = document.getElementById("postContent").value.trim();

//   if (!title || !content) {
//     alert("All fields required");
//     return;
//   }

//   try {
//     await addDoc(collection(fs, "posts"), {
//       clubId: clubId,                 // ✅ VERY IMPORTANT
//       title: title,
//       content: content,
//       createdBy: auth.currentUser.email,
//       createdAt: serverTimestamp()
//     });
//     alert("post created ✅")
//     createPostForm.reset();
//     createPostForm.classList.add("hidden");
    
//   postsContainer.classList.remove('hidden');
//   clubdetailheader.classList.remove('hidden');
//   headingposts.classList.remove('hidden');
   
//     loadPosts(); // reload after posting
//   } catch (err) {
//     console.error(err);
//     alert(err.message);
//   }
// });

// /* -------------------- LOAD POSTS -------------------- */
// async function loadPosts() {
//   postsContainer.innerHTML = "";

//   try {
//     const postsRef = collection(fs, "posts");

//     const q = query(
//       postsRef,
//       where("clubId", "==", clubId),
//       orderBy("createdAt", "desc")
//     );

//     const snapshot = await getDocs(q);

//     if (snapshot.empty) {
//       postsContainer.innerHTML = "<p>No posts yet</p>";
//       return;
//     }

//     snapshot.forEach((docSnap) => {
//       const post = docSnap.data();

//       postsContainer.innerHTML += `
//           <div class="post-card">
//             <div class="post-image">
//               <i class="fa-regular fa-message"></i>
//             </div>
//             <div class="post-content">
//               <h3 class="post-title">${post.title}</h3>
//               <p class="post-text">
//                 ${post.content}
//               </p>
              
//               <hr>
//               <br>
//               <div class="post-date"> Posted by ${post.createdBy}</div>
//             </div>
//           </div> 


//       `;
//     });
//   } catch (err) {
//     console.error(err);
//   }
// }

// /* -------------------- INITIAL LOAD -------------------- */
// loadPosts();










// // const createPostForm = document.querySelector("#createPostForm")
// // const params = new URLSearchParams(window.location.search);
// // const clubId = params.get("id"); // ?id=abc123
// // createPostForm.addEventListener("submit", async (e) => {
// //   e.preventDefault();

// //   if (!auth.currentUser) {
// //     alert("Login required");
// //     return;
// //   }
  

// //   const title = document.getElementById("postTitle").value.trim();
// //   const content = document.getElementById("postContent").value.trim();

// //   if (!title || !content) return;

// //   try {
// //     await addDoc(collection(fs, "posts"), {
// //       clubId, // ✅ VERY IMPORTANT
// //       title,
// //       content,
// //       createdBy: auth.currentUser.email,
// //       createdAt: serverTimestamp()
// //     });
// //     

// //     createPostForm.reset();
// //     createPostForm.classList.add("hidden");

// //     loadPosts(clubId); // ✅ reload correctly
// //   } catch (err) {
// //     alert(err.message);
// //   }
// // });
// // async function loadPosts(clubId) {
// //   postsContainer.innerHTML = "";

// //   const postsRef = collection(fs, "posts");

// //   const q = query(
// //     postsRef,
// //     where("clubId", "==", clubId),
// //     orderBy("createdAt", "desc")
// //   );

// //   const snapshot = await getDocs(q);

// //   if (snapshot.empty) {
// //     postsContainer.innerHTML = "<p>No posts yet</p>";
// //     return;
// //   }

// //   snapshot.forEach((docSnap) => {
// //     const post = docSnap.data();

// //     postsContainer.innerHTML += `
// //     <div class="post-card">
// //             <div class="post-image">
// //               <i class="fas fa-chalkboard-teacher"></i>
// //             </div>
// //             <div class="post-content">
// //               <h3 class="post-title">${post.title}</h3>
// //               <p class="post-text">
// //                 ${post.content}
// //               </p>
// //               <div class="post-date">Posted by ${post.createdBy}</div>
// //             </div>
// //           </div>

// //     `;
// //   });
// // }
// // if (clubId) {
// //   loadPosts(clubId);
// // } else {
// //   console.error("Club ID missing in URL");
// // }
// // window.location.href = `club-detail.html?id=${club.id}`;
// // if (!clubId) {
// //   alert("Invalid club link");
// //   throw new Error("Club ID missing in URL");
// // }