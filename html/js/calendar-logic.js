/* js/calendar-logic.js */

// --- 1. MASTER DATABASE (The "Source of Truth") ---
// Ideally, this data comes from your backend.
const allEvents = [
    {
        id: 1,
        title: "Python Bootcamp",
        date: "2026-01-15", 
        time: "10:00 AM",
        clubId: "tech-club", // Used for filtering
        category: "tech",    // Used for dot color
        description: "A complete intro to Python programming."
    },
    {
        id: 2,
        title: "Salsa Workshop",
        date: "2026-01-15",
        time: "06:00 PM",
        clubId: "dance-club",
        category: "cultural",
        description: "Learn Salsa basics."
    },
    {
        id: 3,
        title: "Cricket Finals",
        date: "2026-01-20",
        time: "09:00 AM",
        clubId: "sports-club",
        category: "sports",
        description: "Inter-college cricket final match."
    },
    {
        id: 4,
        title: "Music Fest",
        date: "2026-02-05",
        time: "05:00 PM",
        clubId: "music-club",
        category: "fest",
        description: "Live bands and food stalls."
    }
];

// --- 2. CALENDAR STATE ---
let currentDate = new Date(); // Keeps track of the currently viewed month
let activeClubFilter = null;  // null = Master View, "string" = Club View

// --- 3. CORE LOGIC: Generate the Grid ---
function renderCalendar(filterClubId = null) {
    activeClubFilter = filterClubId;
    
    // Select DOM elements
    const monthYearText = document.getElementById("monthLabel");
    const daysContainer = document.getElementById("calendarDays");
    
    // Clear previous days
    daysContainer.innerHTML = "";

    // Set variables for the viewed month
    // Note: We clone the date to avoid mutating the global state accidentally during calculations
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update Header Text
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearText.innerText = `${months[month]} ${year}`;

    // --- MATH FOR INFINITE DAYS ---
    // 1. Get the first day of the month (0=Sun, 1=Mon...)
    const firstDayIndex = new Date(year, month, 1).getDay();
    
    // 2. Get the last date of the current month (e.g., 28, 30, 31)
    const lastDate = new Date(year, month + 1, 0).getDate();
    
    // 3. Get the last date of the PREVIOUS month (for padding)
    const prevLastDate = new Date(year, month, 0).getDate();
    
    // 4. Calculate next days padding (to fill the grid to 42 cells usually)
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    let calendarHTML = "";

    // --- RENDER PREVIOUS MONTH DATES (Padding) ---
    for (let x = firstDayIndex; x > 0; x--) {
        calendarHTML += `<div class="day other-month"><span class="day-number">${prevLastDate - x + 1}</span></div>`;
    }

    // --- RENDER CURRENT MONTH DATES ---
    for (let i = 1; i <= lastDate; i++) {
        // Construct date string YYYY-MM-DD for comparison
        const checkDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        
        // FILTER EVENTS:
        // If activeClubFilter is null, we get ALL events (Master).
        // If activeClubFilter is set, we only get events for that club.
        let daysEvents = allEvents.filter(event => {
            return event.date === checkDate && 
                   (activeClubFilter ? event.clubId === activeClubFilter : true);
        });

        // Check if today
        const today = new Date();
        const isToday = (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) ? "today" : "";

        // Build Dots
        let dotsHTML = "";
        if (daysEvents.length > 0) {
            dotsHTML = `<div class="event-indicators">`;
            daysEvents.forEach(evt => {
                dotsHTML += `<div class="event-dot" style="background: var(--${evt.category});"></div>`;
            });
            dotsHTML += `</div>`;
        }

        // Add the day cell
        // Note the onclick function passing the specific date
        calendarHTML += `
            <div class="day ${isToday}" onclick="openPopup('${checkDate}')">
                <span class="day-number">${i}</span>
                ${dotsHTML}
            </div>
        `;
    }

    // --- RENDER NEXT MONTH DATES (Padding) ---
    for (let j = 1; j <= nextDays; j++) {
        calendarHTML += `<div class="day other-month"><span class="day-number">${j}</span></div>`;
    }

    // Inject into HTML
    daysContainer.innerHTML = calendarHTML;
}

// --- 4. NAVIGATION CONTROLS ---
document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(activeClubFilter);
});

document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(activeClubFilter);
});

document.getElementById("todayBtn").addEventListener("click", () => {
    currentDate = new Date();
    renderCalendar(activeClubFilter);
});


// --- 5. POPUP FEATURE ---
function openPopup(dateString) {
    // 1. Filter events again for this specific clicked date
    const eventsOnDay = allEvents.filter(event => {
        return event.date === dateString && 
               (activeClubFilter ? event.clubId === activeClubFilter : true);
    });

    // 2. If no events, do nothing (or show "No events" message if you prefer)
    if (eventsOnDay.length === 0) return;

    // 3. Populate Modal
    const modal = document.getElementById("eventModal");
    const modalList = document.getElementById("modalEventList");
    const modalTitle = document.getElementById("modalDateTitle");
    
    // Format date nicely (e.g., "Mon, Jan 15")
    const dateObj = new Date(dateString);
    modalTitle.innerText = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });

    // Generate List HTML
    let listHTML = "";
    eventsOnDay.forEach(evt => {
        listHTML += `
            <div class="event-card" style="border-left: 4px solid var(--${evt.category});">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4>${evt.title}</h4>
                    <span class="badge" style="background:var(--${evt.category}); color:#fff; font-size:0.7rem;">${evt.category}</span>
                </div>
                <div class="event-meta" style="margin-top:5px; color:#aaa;">
                    <i class="far fa-clock"></i> ${evt.time} &nbsp;|&nbsp; 
                    <i class="fas fa-users"></i> ${activeClubFilter ? 'This Club' : evt.clubId}
                </div>
                <p style="margin-top:8px; font-size:0.9rem;">${evt.description}</p>
            </div>
        `;
    });

    modalList.innerHTML = listHTML;
    modal.classList.remove("hidden");
}

// Close Modal
const closeModalBtn = document.getElementById("closeModal");
const modalOverlay = document.getElementById("eventModal");

if(closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
        modalOverlay.classList.add("hidden");
    });
}

// Close on click outside
window.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.add("hidden");
    }
});