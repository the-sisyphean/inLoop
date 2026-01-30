document.addEventListener("DOMContentLoaded", () => {
  console.log("club-detail.js loaded");

  // Get tab buttons
  const tabs = {
    posts: document.querySelector('[data-testid="tab-posts"]'),
    resources: document.querySelector('[data-testid="tab-resources"]'),
    calendar: document.querySelector('[data-testid="tab-calendar"]'),
    members: document.querySelector('[data-testid="tab-members"]')
  };

  // Get content sections
  const sections = {
    posts: document.getElementById("posts-section"),
    resources: document.getElementById("resources-section"),
    calendar: document.getElementById("calendar-section"),
    members: document.getElementById("members-section")
  };

  // Safety check (important)
  if (!tabs.posts || !sections.posts) {
    console.error("Tabs or sections not found");
    return;
  }

  // Function to switch tabs
  function showSection(active) {
    Object.values(sections).forEach(sec => sec.style.display = "none");
    Object.values(tabs).forEach(tab => tab.classList.remove("active"));

    sections[active].style.display = "block";
    tabs[active].classList.add("active");
  }

  // Attach click listeners
  tabs.posts.addEventListener("click", () => showSection("posts"));
  tabs.resources.addEventListener("click", () => showSection("resources"));
  tabs.calendar.addEventListener("click", () => showSection("calendar"));
  tabs.members.addEventListener("click", () => showSection("members"));
});
