// import { fs } from "./firebase.js";
// import {
//   collection,
//   query,
//   getDocs
// } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// async function loadEvents() {
//   const q = query(collection(fs, "events"));
//   const snapshot = await getDocs(q);

//   snapshot.forEach(docSnap => {
//     renderEvent(docSnap.data());
//   });
// }

// const menuToggle = document.getElementById("menuToggle");
// const sidebar = document.getElementById("sidebar");
// const layout = document.querySelector(".main-layout");

// menuToggle.addEventListener("click", () => {
//   sidebar.classList.toggle("open");
//   layout.classList.toggle("sidebar-open");
// });

// document.addEventListener("click", (e) => {
//   if (
//     !sidebar.contains(e.target) &&
//     !menuToggle.contains(e.target)
//   ) {
//     sidebar.classList.remove("open");
//     layout.classList.remove("sidebar-open");
//   }
// });

//   const chips = document.querySelectorAll(".chip");
//   const eventCards = document.querySelectorAll(".event-card");

//   chips.forEach(chip => {
//     chip.addEventListener("click", () => {
//       // remove active from all chips
//       chips.forEach(c => c.classList.remove("active"));
//       chip.classList.add("active");

//       const selectedCategory = chip.dataset.category;

//       eventCards.forEach(card => {
//         const cardCategory = card.dataset.category;

//         if (selectedCategory === "all" || cardCategory === selectedCategory) {
//           card.style.display = "block";
//         } else {
//           card.style.display = "none";
//         }
//       });
//     });
//   });

// loadEvents();

// function renderEvent(event) {
//   const container = document.getElementById("events");
//   if (!container) return;

//   const card = document.createElement("div");
//   card.className = "event-card";

//   card.innerHTML = `
//     <h3>${event.title}</h3>
//     <p>${event.clubName}</p>
//     <span>${new Date(event.date).toLocaleString()}</span>
//   `;

//   container.appendChild(card);
// }

