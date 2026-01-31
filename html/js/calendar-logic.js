/* js/club-calendar.js */

// ==========================================
// 1. SIMULATING 3 SEPARATE DATABASES (CLUBS)
// ==========================================

const database_TechClub = [
    { id: 't1', title: "Hackathon Intro", date: "2026-01-05", time: "10:00 AM", category: "tech", clubName: "Tech Club", desc: "Intro to coding." },
    { id: 't2', title: "AI Workshop", date: "2026-01-15", time: "02:00 PM", category: "tech", clubName: "Tech Club", desc: "Learning Neural Networks." }
];

const database_CulturalClub = [
    { id: 'c1', title: "Salsa Night", date: "2026-01-15", time: "06:00 PM", category: "cultural", clubName: "Cultural Club", desc: "Dance workshop." },
    { id: 'c2', title: "Pottery Class", date: "2026-01-20", time: "11:00 AM", category: "cultural", clubName: "Cultural Club", desc: "Clay modeling basics." }
];

const database_SportsClub = [
    { id: 's1', title: "Cricket Finals", date: "2026-01-25", time: "09:00 AM", category: "sports", clubName: "Sports Club", desc: "Inter-college match." },
    { id: 's2', title: "Morning Yoga", date: "2026-02-01", time: "06:00 AM", category: "sports", clubName: "Sports Club", desc: "Wellness session." }
];

// ==========================================
// 2. THE MERGE LOGIC (Master Database)
// ==========================================
const masterCalendarData = [
    ...database_TechClub, 
    ...database_CulturalClub, 
    ...database_SportsClub
];

// ==========================================
// 3. INFINITE CALENDAR LOGIC
// ==========================================

let currentDate = new Date(); 

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update Header
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById("monthLabel").innerText = `${months[month]} ${year}`;

    const daysContainer = document.getElementById("calendarDays");
    daysContainer.innerHTML = ""; 

    // Date Calculations
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate(); 
    const prevLastDate = new Date(year, month, 0).getDate();
    const lastDayIndex = new Date(year, month + 1, 0).getDay();
    const nextDays = 7 - lastDayIndex - 1;

    let html = "";

    // Prev Month Padding
    for (let x = firstDayIndex; x > 0; x--) {
        html += `<div class="day other-month">${prevLastDate - x + 1}</div>`;
    }

    // Current Month
    for (let i = 1; i <= lastDate; i++) {
        const currentLoopDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const eventsOnThisDay = masterCalendarData.filter(event => event.date === currentLoopDate);
        
        const today = new Date();
        const isToday = (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) ? "today" : "";

        // Build Dots
        let dotsHtml = "";
        if (eventsOnThisDay.length > 0) {
            dotsHtml = `<div class="dots-container">`;
            eventsOnThisDay.forEach(evt => {
                dotsHtml += `<span class="dot ${evt.category}"></span>`;
            });
            dotsHtml += `</div>`;
        }

        html += `
            <div class="day ${isToday}" onclick="openDateModal('${currentLoopDate}')">
                <span class="day-number">${i}</span>
                ${dotsHtml}
            </div>
        `;
    }

    // Next Month Padding
    for (let j = 1; j <= nextDays; j++) {
        html += `<div class="day other-month">${j}</div>`;
    }

    daysContainer.innerHTML = html;
}

// ==========================================
// 4. MODAL & ALARM LOGIC
// ==========================================

window.openDateModal = function(dateString) {
    const events = masterCalendarData.filter(e => e.date === dateString);
    const modal = document.getElementById("eventModal");
    const modalList = document.getElementById("modalEventList");
    const modalTitle = document.getElementById("modalDateTitle");

    const dateObj = new Date(dateString);
    modalTitle.innerText = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    if (events.length === 0) {
        modalList.innerHTML = `<p style="text-align:center; color:#888; padding:20px;">No events scheduled.</p>`;
    } else {
        // Inject Alarm Button Here
        modalList.innerHTML = events.map(e => `
            <div class="event-card-item border-${e.category}">
                <div class="card-header-row">
                    <div class="meta">
                        <span class="time">${e.time}</span>
                        <span class="badge bg-${e.category}">${e.category}</span>
                    </div>
                    <button class="alarm-btn" onclick="setReminder('${e.title}', this)">
                        <i class="far fa-bell"></i>
                    </button>
                </div>
                <h4>${e.title}</h4>
                <small style="color:#666;">Hosted by: ${e.clubName}</small>
                <p>${e.desc}</p>
            </div>
        `).join("");
    
    }
    modal.classList.remove("hidden");
}