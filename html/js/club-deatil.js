document.addEventListener("DOMContentLoaded", () => {
  console.log("club-detail.js loaded");

  // ----- TAB BUTTONS -----
  const tabs = {
    posts: document.querySelector('[data-testid="tab-posts"]'),
    resources: document.querySelector('[data-testid="tab-resources"]'),
    calendar: document.querySelector('[data-testid="tab-calendar"]'),
    members: document.querySelector('[data-testid="tab-members"]')
  };

  // ----- TAB SECTIONS -----
  const sections = {
    posts: document.getElementById("posts-section"),
    resources: document.getElementById("resources-section"),
    calendar: document.getElementById("calendar-section"),
    members: document.getElementById("members-section")
  };

  // ----- SAFETY CHECK -----
  for (const key in tabs) {
    if (!tabs[key] || !sections[key]) {
      console.error(`Missing tab or section: ${key}`);
      return;
    }
  }

  // ----- TAB SWITCH FUNCTION -----
  function showSection(active) {
    Object.values(sections).forEach(section => {
      section.style.display = "none";
    });

    Object.values(tabs).forEach(tab => {
      tab.classList.remove("active");
    });

    sections[active].style.display = "block";
    tabs[active].classList.add("active");
  }

  // ----- CLICK HANDLERS -----
  tabs.posts.addEventListener("click", () => showSection("posts"));
  tabs.resources.addEventListener("click", () => showSection("resources"));
  tabs.calendar.addEventListener("click", () => showSection("calendar"));
  tabs.members.addEventListener("click", () => showSection("members"));

  // ----- DEFAULT VIEW -----
  showSection("posts");

  // ----- READ CLUB FROM URL (for later Firebase use) -----
  const params = new URLSearchParams(window.location.search);
  const clubId = params.get("club") || "coding-club";

  console.log("Viewing club:", clubId);
});
