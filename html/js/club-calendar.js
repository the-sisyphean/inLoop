/* js/club-calendar.js */

// ==========================================
// 1. DATA MERGING LOGIC (Database + LocalStorage)
// ==========================================

const default_TechClub = [
    { id: 't1', title: "Hackathon Intro", date: "2026-01-05", time: "10:00 AM", category: "tech", clubName: "Tech Club", desc: "Intro to coding." },
    { id: 't2', title: "AI Workshop", date: "2026-01-15", time: "02:00 PM", category: "tech", clubName: "Tech Club", desc: "Learning Neural Networks." }
];
const default_CulturalClub = [
    { id: 'c1', title: "Salsa Night", date: "2026-01-15", time: "06:00 PM", category: "cultural", clubName: "Cultural Club", desc: "Dance workshop." },
    { id: 'c2', title: "Pottery Class", date: "2026-01-20", time: "11:00 AM", category: "cultural", clubName: "Cultural Club", desc: "Clay modeling basics." }
];
const default_SportsClub = [
    { id: 's1', title: "Cricket Finals", date: "2026-01-25", time: "09:00 AM", category: "sports", clubName: "Sports Club", desc: "Inter-college match." },
    { id: 's2', title: "Morning Yoga", date: "2026-02-01", time: "06:00 AM", category: "sports", clubName: "Sports Club", desc: "Wellness session." }
];

function getMasterData() {
    // 1. Combine Hardcoded Data
    const hardcoded = [...default_TechClub, ...default_CulturalClub, ...default_SportsClub];
    
    // 2. Fetch User Data from Browser Memory
    const storedEvents = JSON.parse(localStorage.getItem('myCustomEvents')) || [];
    
    // 3. Merge Both
    return [...hardcoded, ...storedEvents];
}

// Initialize Data
let masterCalendarData = getMasterData();
let currentDate = new Date(); 

// ==========================================
// 2. RENDER CALENDAR UI
// ==========================================
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
        
        // Filter events for this specific day
        const eventsOnThisDay = masterCalendarData.filter(event => event.date === currentLoopDate);
        
        const today = new Date();
        const isToday = (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) ? "today" : "";

        // Create Colored Dots
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

// ==========================================
// 3. VIEW EVENT MODAL (With Alarm)
// ==========================================
window.openDateModal = function(dateString) {
    // Refresh data in case something was just added
    masterCalendarData = getMasterData();
    
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
                <small style="color:#666; display:block; margin-bottom:5px;">Hosted by: ${e.clubName}</small>
                <p>${e.desc}</p>
            </div>
        `).join("");
    }
    modal.classList.remove("hidden");
}

// ==========================================
// 4. ALARM LOGIC
// ==========================================
window.setReminder = function(eventTitle, btnElement) {
    if (!("Notification" in window)) {
        alert("This browser does not support notifications");
        return;
    }

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
    // Visual Change (Red Bell)
    const icon = btn.querySelector("i");
    icon.classList.remove("far");
    icon.classList.add("fas");
    icon.style.color = "#e74c3c"; 

    // System Notification
    new Notification("Reminder Set!", {
        body: `We will remind you before: ${title}`,
        icon: "https://cdn-icons-png.flaticon.com/512/3239/3239952.png"
    });
}

// ==========================================
// 5. STARTUP & EVENT LISTENERS
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    renderCalendar();

    // -- Calendar Navigation --
    document.getElementById("prevMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    document.getElementById("nextMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    document.getElementById("todayBtn").addEventListener("click", () => {
        currentDate = new Date();
        renderCalendar();
    });

    // -- Modal Closing Logic --
    const modals = document.querySelectorAll(".event-modal");
    document.getElementById("closeModal").addEventListener("click", () => document.getElementById("eventModal").classList.add("hidden"));
    document.getElementById("closeAddModal").addEventListener("click", () => document.getElementById("addEventModal").classList.add("hidden"));
    
    // Close when clicking outside
    window.onclick = function(event) {
        if (event.target.classList.contains('event-modal')) {
            event.target.classList.add("hidden");
        }
    }

    // ============================
    // 6. ADD EVENT LOGIC (New)
    // ============================
    const addModal = document.getElementById("addEventModal");
    const addBtn = document.getElementById("addEventBtn");
    const form = document.getElementById("newEventForm");

    // Open Form
    if(addBtn) addBtn.addEventListener("click", () => {
        addModal.classList.remove("hidden");
    });

    // Submit Form
    if(form) form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get Values
        const title = document.getElementById("evtTitle").value;
        const date = document.getElementById("evtDate").value;
        const timeInput = document.getElementById("evtTime").value;
        const category = document.getElementById("evtCategory").value;
        const desc = document.getElementById("evtDesc").value;

        // Convert Time (14:00 -> 02:00 PM)
        const timeObj = new Date(`1970-01-01T${timeInput}:00`);
        const formattedTime = timeObj.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'});

        // Create Object
        const newEvent = {
            id: Date.now().toString(),
            title: title,
            date: date,
            time: formattedTime,
            category: category,
            clubName: "User Event",
            desc: desc
        };

        // Save to LocalStorage
        const currentStored = JSON.parse(localStorage.getItem('myCustomEvents')) || [];
        currentStored.push(newEvent);
        localStorage.setItem('myCustomEvents', JSON.stringify(currentStored));

        // Refresh Data & UI
        masterCalendarData = getMasterData(); 
        renderCalendar();

        // Close & Reset
        addModal.classList.add("hidden");
        form.reset();
        alert("Event successfully created!");
    });
});