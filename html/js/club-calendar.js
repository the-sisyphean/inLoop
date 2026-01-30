const monthLabel = document.getElementById("monthLabel");
const calendarDays = document.getElementById("calendarDays");
const prevBtn = document.getElementById("prevMonth");
const nextBtn = document.getElementById("nextMonth");
const todayBtn = document.getElementById("todayBtn");

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
