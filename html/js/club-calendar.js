/* js/club-calendar.js */

// =======================
// 1. DATA
// =======================
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

const masterCalendarData = [...database_TechClub, ...database_CulturalClub, ...database_SportsClub];

let currentDate = new Date(); 

// =======================
// 2. RENDER CALENDAR
// =======================
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    document.getElementById("monthLabel").innerText = `${months[month]} ${year}`;
    const daysContainer = document.getElementById("calendarDays");
    daysContainer.innerHTML = ""; 

    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate(); 
    const prevLastDate = new Date(year, month, 0).getDate();
    
    let html = "";

    // Prev Month Padding
    for (let x = firstDayIndex; x > 0; x--) {
        html += `<div class="day other-month">${prevLastDate - x + 1}</div>`;
    }

    // Current Month Days
    for (let i = 1; i <= lastDate; i++) {
        const currentLoopDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const eventsOnThisDay = masterCalendarData.filter(event => event.date === currentLoopDate);
        
        const today = new Date();
        const isToday = (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) ? "today" : "";

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
    daysContainer.innerHTML = html;
}

// =======================
// 3. MODAL LOGIC (With Alarm)
// =======================
window.openDateModal = function(dateString) {
    const events = masterCalendarData.filter(e => e.date === dateString);
    const modal = document.getElementById("eventModal");
    const modalList = document.getElementById("modalEventList");
    
    const dateObj = new Date(dateString);
    document.getElementById("modalDateTitle").innerText = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    if (events.length === 0) {
        modalList.innerHTML = `<p style="padding:20px; text-align:center; color:#666;">No events on this day.</p>`;
    } else {
        modalList.innerHTML = events.map(e => `
            <div class="event-card-item border-${e.category}">
                <div class="card-header-row">
                    <div class="meta">
                        <span class="badge bg-${e.category}">${e.category}</span>
                        <span class="time">${e.time}</span>
                    </div>
                    <button class="alarm-btn" onclick="setReminder('${e.title}', this)">
                        <i class="far fa-bell"></i>
                    </button>
                </div>
                <h4>${e.title}</h4>
                <p>${e.desc}</p>
            </div>
        `).join("");
    }
    modal.classList.remove("hidden");
}

// =======================
// 4. ALARM FUNCTIONALITY
// =======================
window.setReminder = function(eventTitle, btnElement) {
    // Check browser support
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
        return;
    }

    // Check permissions
    if (Notification.permission === "granted") {
        createNotification(eventTitle, btnElement);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                createNotification(eventTitle, btnElement);
            }
        });
    }
}

function createNotification(title, btn) {
    // 1. Visual Feedback (Turn icon red)
    const icon = btn.querySelector("i");
    icon.classList.remove("far");
    icon.classList.add("fas");
    icon.style.color = "#e74c3c"; 

    // 2. System Notification
    new Notification("Reminder Set!", {
        body: `We will remind you before: ${title}`,
        icon: "https://cdn-icons-png.flaticon.com/512/3239/3239952.png"
    });
}

// =======================
// 5. STARTUP
// =======================
document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();

    // Attach listeners safely
    const prevBtn = document.getElementById("prevMonth");
    const nextBtn = document.getElementById("nextMonth");
    const todayBtn = document.getElementById("todayBtn");
    const closeBtn = document.getElementById("closeModal");
    const modal = document.getElementById("eventModal");

    if(prevBtn) prevBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    if(nextBtn) nextBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    if(todayBtn) todayBtn.addEventListener("click", () => {
        currentDate = new Date();
        renderCalendar();
    });

    if(closeBtn) closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });
    
    // Close modal when clicking background
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
});