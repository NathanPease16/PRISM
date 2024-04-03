// const socket = io();

let lastTime = Date.now();
let currentTime = 0;

function formatTime(time, minuteLength, secondLength) {
    // Divide by 60, convert to integer to get minutes and pad start
    const minutes = Math.floor(time / 60).toString().padStart(minuteLength, '0');
    // Get remainder after dividing by 60 to get seconds, pad start
    const seconds = Math.floor(time % 60).toString().padStart(secondLength, '0');

    return `${minutes}:${seconds}`;
}

function updateTimer() {
    // Get current time and subtract from previous time to get
    // dt, which is time since last frame to accurately update
    // the timer's text
    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    // subtract dt from current time
    currentTime -= deltaTime;

    // if the time is 0, reset and stop timer
    if (currentTime <= 0) {
        timerActive = false;
        currentTime = 0;
    }
}