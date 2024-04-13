/**
 * Handles unmoderated caucuses using the timer
 * class to easily manage time, and alerts 
 * all listening clients of the current time
 * in the unmoderated caucus
 * 
 * @summary Handles unmoderated caucuses
 * 
 * @author Nathan Pease
 */

const unmodPlay = document.getElementById('unmod-play');
const unmodReset = document.getElementById('unmod-reset');
const unmodSettings = document.getElementById('unmod-settings');

const unmodTimeText = document.getElementById('unmod-time');

const unmodPlayImage = document.getElementById('unmod-play-img');
const unmodPauseImage = document.getElementById('unmod-pause-img');

const unmodTimer = new Timer(60, unmodTimeText, unmodPlayImage, unmodPauseImage);

// Plays the unmod timer and sets current action
const playUnmodTimer = () => {
    unmodTimer.play();
    setCurrentAction({ type: 'unmod', totalTime: unmodTimer.time, currentTime: unmodTimer.currentTime, active: true });
}

// Pauses the unmod timer and sets current action
const pauseUnmodTimer = () => {
    unmodTimer.pause();
    setCurrentAction({ type: 'unmod', totalTime: unmodTimer.time, currentTime: unmodTimer.currentTime, active: false });
}

// Resets the unmod timer and sets current action
const resetUnmodTimer = () => {
    unmodTimer.reset();
    setCurrentAction({ type: 'unmod', totalTime: unmodTimer.time, currentTime: unmodTimer.currentTime, active: false });
}

// Play if paused, pause if playing
unmodPlay.addEventListener('click', () => {
    if (!unmodTimer.active) {
        playUnmodTimer();
    } else {
        pauseUnmodTimer();
    }
});

// Reset timer when button is pressed
unmodReset.addEventListener('click', () => {
    resetUnmodTimer();
});

unmodSettings.addEventListener('click', () => {
    const settingsPopup = new Popup();

    // Get default values
    const initMinutes = Math.floor(unmodTimer.time / 60);
    const initSeconds = Math.floor(unmodTimer.time % 60);

    settingsPopup.addSmallHeader('Settings');
    settingsPopup.addText('Duration');

    const minutes = settingsPopup.addInput(`Minutes`);
    minutes.type = 'number';

    const seconds = settingsPopup.addInput(`Seconds`);
    seconds.type = 'number';

    settingsPopup.addButton('Confirm Changes', 'blue', () => {
        let min;
        let sec;

        // If no changes were made to min AND second, leave them as their
        // initial values
        if (minutes.value === '' && seconds.value === '') {
            min = initMinutes;
            sec = initSeconds;
        // Otherwise, set them to their given values (or 0 is none is given)
        } else {
            min = minutes.value == '' ? 0 : parseFloat(minutes.value);
            sec = seconds.value == '' ? 0 : parseFloat(seconds.value);
        }

        // Set the time and reset the timer
        unmodTimer.setTime(min * 60 + sec);
        resetUnmodTimer();

        settingsPopup.remove();
    });

    settingsPopup.addButton('Cancel', 'red', () => {
        settingsPopup.remove();
    });

    settingsPopup.show();
});

function setUnmodTime(time) {
    unmodTimer.setTime(time);
    resetUnmodTimer();
}