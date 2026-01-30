document.addEventListener("DOMContentLoaded", () => {
  console.log("calendar.js loaded");

  const monthTitle = document.querySelector(".month-nav h2");
  const prevBtn = document.querySelector('[data-testid="prev-month-btn"]');
  const nextBtn = document.querySelector('[data-testid="next-month-btn"]');
  const daysContainer = document.querySelector(".days");

  let currentDate = new Date(2025, 11); // December 2025 (month is 0-based)

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  function updateMonthTitle() {
    monthTitle.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  }

  function clearTodayHighlight() {
    document.querySelectorAll(".day.today").forEach(d =>
      d.classList.remove("today")
    );
  }

  function markTodayIfVisible() {
    const today = new Date();
    if (
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    ) {
      const dayEl = document.querySelector(
        `.day[data-testid="day-${today.getDate()}"]`
      );
      if (dayEl) dayEl.classList.add("today");
    }
  }

  // Month navigation
  prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateMonthTitle();
    clearTodayHighlight();
    markTodayIfVisible();
    console.log("Moved to previous month");
  });

  nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateMonthTitle();
    clearTodayHighlight();
    markTodayIfVisible();
    console.log("Moved to next month");
  });

  // Day click handling
  document.querySelectorAll(".day").forEach(day => {
    day.addEventListener("click", () => {
      if (day.classList.contains("other-month")) return;

      const dayNumber = day.querySelector(".day-number")?.textContent;
      console.log(
        `Clicked date: ${dayNumber} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
      );

      // TEMP behavior (replace with modal / Firestore later)
      alert(`Events on ${dayNumber} ${monthNames[currentDate.getMonth()]}`);
    });
  });

  // Init
  updateMonthTitle();
  markTodayIfVisible();
});
