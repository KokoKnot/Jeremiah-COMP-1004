// Load data from local storage or start fresh
let playerData = JSON.parse(localStorage.getItem("playerData")) || {
    playerName: "",
    games: [],
    schedule: []
};

let countdownIntervals = []; // Store active countdown timers

// Function to update local storage
function saveData() {
    localStorage.setItem("playerData", JSON.stringify(playerData));
}

// Function to display gaming time
function displayGamingTime() {
    const gameTimeList = document.getElementById("gameTimeList");
    gameTimeList.innerHTML = "";

    playerData.games.forEach((game, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span>${game.gameName}</span><span>${game.totalTimeSpent} hours</span>`;
        gameTimeList.appendChild(listItem);
    });

    displayCountdowns();
}

// Function to display schedule
function displaySchedule() {
    const scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    playerData.schedule.forEach(event => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `<span>${event.eventName}</span><span>${event.eventTime}</span>`;
        scheduleList.appendChild(listItem);
    });
}

// Function to display countdown timers
function displayCountdowns() {
    const countdownSection = document.getElementById("countdownList");
    countdownSection.innerHTML = "";

    playerData.games.forEach((game, index) => {
        if (!game.timeLeft) {
            game.timeLeft = parseInt(game.totalTimeSpent) * 60 * 60; // Convert hours to seconds
        }

        const listItem = document.createElement("li");
        listItem.innerHTML = `<span>${game.gameName} - Time Left: <span id="timer-${index}">${formatTime(game.timeLeft)}</span></span>`;
        countdownSection.appendChild(listItem);

        startCountdown(index);
    });

    saveData();
}

// Function to format time (hh:mm:ss)
function formatTime(seconds) {
    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    let secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Function to start countdown timers
function startCountdown(index) {
    let game = playerData.games[index];

    let countdownInterval = setInterval(() => {
        if (game.timeLeft > 0) {
            game.timeLeft--;
            document.getElementById(`timer-${index}`).innerText = formatTime(game.timeLeft);
            saveData();
        } else {
            clearInterval(countdownInterval);
            alert(`Time To Stop Playing!`);
        }
    }, 1000);

    countdownIntervals.push(countdownInterval); // Store interval to clear later
}

// Function to clear all data and reset timers
function resetData() {
    localStorage.removeItem("playerData"); // Remove saved data
    playerData = { playerName: "", games: [], schedule: [] }; // Reset data

    // Clear UI
    document.getElementById("gameTimeList").innerHTML = "";
    document.getElementById("scheduleList").innerHTML = "";
    document.getElementById("countdownList").innerHTML = "";

    // Stop all active countdown timers
    countdownIntervals.forEach(clearInterval);
    countdownIntervals = []; // Reset timer storage

    alert("All data has been cleared!");
}

// Event listener for adding new games
document.getElementById("addGameForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const gameName = document.getElementById("gameName").value;
    const gameTime = document.getElementById("gameTime").value;

    playerData.games.push({
        gameName: gameName,
        totalTimeSpent: gameTime,
        timeLeft: parseInt(gameTime) * 60 * 60 // Convert hours to seconds
    });

    saveData();
    displayGamingTime();

    document.getElementById("gameName").value = "";
    document.getElementById("gameTime").value = "";
});

// Event listener for adding new schedule events
document.getElementById("addScheduleForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const eventName = document.getElementById("eventName").value;
    const eventTime = document.getElementById("eventTime").value;

    playerData.schedule.push({
        eventName: eventName,
        eventTime: eventTime
    });

    saveData();
    displaySchedule();

    document.getElementById("eventName").value = "";
    document.getElementById("eventTime").value = "";
});

// Event listener for reset button
document.getElementById("resetButton").addEventListener("click", resetData);

// Initialize UI on load
window.onload = function () {
    displayGamingTime();
    displaySchedule();
};
