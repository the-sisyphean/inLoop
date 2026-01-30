document.addEventListener("DOMContentLoaded", () => {
  const days = document.querySelectorAll(".day[data-date]");
  const eventsContainer = document.getElementById("day-events");
  const selectedDateEl = document.getElementById("selected-date");

  // MOCK DATA (later from Firestore)
  const eventsByDate = {
    "2025-12-15": [
      {
        title: "Annual Hackathon",
        time: "10:00 AM",
        location: "Computer Lab"
      },
      {
        title: "CP Contest",
        time: "6:00 PM",
        location: "Online"
      }
    ],
    "2025-12-22": [
      {
        title: "Web Dev Workshop",
        time: "2:00 PM",
        location: "Seminar Hall 3"
      }
    ]
  };

  days.forEach(day => {
    day.addEventListener("click", () => {
      const date = day.dataset.date;
      selectedDateEl.textContent = date;
      eventsContainer.innerHTML = "";

      const events = eventsByDate[date];

      if (!events || events.length === 0) {
        eventsContainer.innerHTML = "<p>No events on this day</p>";
        return;
      }

      events.forEach(event => {
        const card = document.createElement("div");
        card.className = "event-card";

        card.innerHTML = `
          <div class="event-body">
            <h3 class="event-title">${event.title}</h3>
            <div class="event-meta">
              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>${event.time}</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.location}</span>
              </div>
            </div>
          </div>
        `;

        eventsContainer.appendChild(card);
      });
    });
  });
});

<script src="./js/club-calendar.js"></script>
