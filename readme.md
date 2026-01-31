<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Calendar - inLoop</title>
    <link rel="stylesheet" href="./css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

    <div class="main-layout">
        <nav class="top-nav">
            <div class="brand">
                <i class="fas fa-graduation-cap"></i>
                inLoop
            </div>
            <div class="user-menu">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="dropdown-menu">
                    <a href="login.html" class="dropdown-item">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </a>
                </div>
            </div>
        </nav>

        <div class="content-wrapper">
            <main class="main-content">
                <div class="calendar-container">
                    
                    <div class="calendar-header">
                        <div class="month-nav">
                            <button id="prevMonth" class="nav-arrow"><i class="fas fa-chevron-left"></i></button>
                            <h2 id="monthLabel">January 2026</h2>
                            <button id="nextMonth" class="nav-arrow"><i class="fas fa-chevron-right"></i></button>
                        </div>
                        <button id="todayBtn">Today</button>
                    </div>

                    <div class="calendar-grid">
                        <div class="weekdays">
                            <div class="weekday">Sun</div>
                            <div class="weekday">Mon</div>
                            <div class="weekday">Tue</div>
                            <div class="weekday">Wed</div>
                            <div class="weekday">Thu</div>
                            <div class="weekday">Fri</div>
                            <div class="weekday">Sat</div>
                        </div>

                        <div class="days" id="calendarDays"></div>
                    </div>

                </div>
            </main>
        </div>

        <nav class="bottom-nav">
            <a href="home.html" class="nav-item">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </a>
            <a href="calendar.html" class="nav-item active">
                <i class="fas fa-calendar-alt"></i>
                <span>Calendar</span>
            </a>
            <a href="clubs.html" class="nav-item">
                <i class="fas fa-users"></i>
                <span>Clubs</span>
            </a>
        </nav>
    </div>

    <div class="event-modal hidden" id="eventModal">
        <div class="event-modal-card">
            <div class="event-modal-header">
                <h3 id="modalDateTitle">Selected Date</h3>
                <button id="closeModal">&times;</button>
            </div>
            <div id="modalEventList">
                </div>
        </div>
    </div>

    <script src="./js/club-calendar.js"></script>

</body>
</html>