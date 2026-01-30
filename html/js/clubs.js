document.addEventListener("DOMContentLoaded", () => {
  // Filter chips
  const filterChips = document.querySelectorAll(".filter-chips .chip");
  const clubCards = document.querySelectorAll(".club-card");

  // Helper: get category from badge text
  function getClubCategory(card) {
    const badge = card.querySelector(".badge");
    if (!badge) return "all";
    return badge.textContent.toLowerCase();
  }

  // Filter logic
  filterChips.forEach(chip => {
    chip.addEventListener("click", () => {
      // Remove active from all chips
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const filter = chip.textContent.toLowerCase().trim();

      clubCards.forEach(card => {
        const category = getClubCategory(card);

        if (filter === "all" || category.includes(filter)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Club card navigation (pass club id)
  clubCards.forEach(card => {
    card.addEventListener("click", () => {
      const clubName = card.querySelector(".club-card-title").textContent;
      const clubId = clubName.toLowerCase().replace(/\s+/g, "-");

      window.location.href = `club-detail.html?club=${clubId}`;
    });
  });
});
