/*
const timer = document.getElementById('timer');
const time = document.getElementById('time');
const timerToggle = document.getElementById('timer-toggle');
*/

// const socket = io();

// let timerActive = false;
let lastTime = Date.now();
// let currentTime = parseFloat(timer.getAttribute('data-startTime')); // In seconds
let currentTime = 0;

function formatTime(time, minuteLength, secondLength, msLength) {
    // Divide by 60, convert to integer to get minutes and pad start
    const minutes = Math.floor(time / 60).toString().padStart(minuteLength, '0');
    // Get remainder after dividing by 60 to get seconds, pad start
    const seconds = Math.floor(time % 60).toString().padStart(secondLength, '0');

    // Gets the 10's, 100's, 1000's, etc. place for rounding based on msLength
    const msRound = 10 ** msLength;

    // Get seconds + ms then subtract seconds to just get ms, then round
    let ms = (Math.round(((currentTime % 60) - seconds) * msRound) / msRound).toString();
    // Get rid of the leading 0
    ms = ms.slice(1, ms.length);

    return `${minutes}:${seconds}${ms}`;
}

function updateTimer() {
    /*
    // If the timer isn't active or already at 0, no need to update
    if (!timerActive || currentTime <= 0) {
        return 
    }
    */

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

    return currentTime;

    /*
    // update timer text content
    time.textContent = formatTime(currentTime, 2, 2, 2);

    // Repeat
    requestAnimationFrame(updateTimer);
    */
}

/*
time.textContent = formatTime(currentTime, 2, 2, 2);

timerToggle.addEventListener('click', () => {
    timerActive = !timerActive;

    // Tell the server the timer was changed
    socket.emit('timer', timerActive);

    // If the timer is active, start updating the time
    if (timerActive) {
        lastTime = Date.now();
        timerToggle.textContent = 'Stop';
        requestAnimationFrame(updateTimer);
    } else {
        timerToggle.textContent = 'Start';
    }
});
*/