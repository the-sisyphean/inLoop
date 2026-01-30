import { fs } from "./firebase.js";
import {
  collection,
  query,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

async function loadEvents() {
  const q = query(collection(fs, "events"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    renderEvent(docSnap.data());
  });
}

loadEvents();

function renderEvent(event) {
  const container = document.getElementById("events");
  if (!container) return;

  const card = document.createElement("div");
  card.className = "event-card";

  card.innerHTML = `
    <h3>${event.title}</h3>
    <p>${event.clubName}</p>
    <span>${new Date(event.date).toLocaleString()}</span>
  `;

  container.appendChild(card);
}

