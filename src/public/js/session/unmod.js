const unmodPlay = document.getElementById('unmod-play');
const unmodReset = document.getElementById('unmod-reset');
const unmodSettings = document.getElementById('unmod-settings');

const unmodTimeText = document.getElementById('unmod-time');

const unmodPlayImage = document.getElementById('unmod-play-img');
const unmodPauseImage = document.getElementById('unmod-pause-img');

const unmodTimer = new Timer(60, unmodTimeText, unmodPlayImage, unmodPauseImage);

const playUnmodTimer = () => {
    unmodTimer.play();
    setCurrentAction({ type: 'unmod', totalTime: unmodTimer.time, currentTime: unmodTimer.currentTime, active: true });
}

const pauseUnmodTimer = () => {
    unmodTimer.pause();
    setCurrentAction({ type: 'unmod', totalTime: unmodTimer.time, currentTime: unmodTimer.currentTime, active: false });
}

const resetUnmodTimer = () => {
    unmodTimer.reset();
    setCurrentAction({ type: 'unmod', totalTime: unmodTimer.time, currentTime: unmodTimer.currentTime, active: false });
}

unmodPlay.addEventListener('click', () => {
    if (!unmodTimer.active) {
        playUnmodTimer();
    } else {
        pauseUnmodTimer();
    }
});

unmodReset.addEventListener('click', () => {
    resetUnmodTimer();
});

unmodSettings.addEventListener('click', () => {
    const settingsPopup = new Popup();
    const initMinutes = Math.floor(unmodTimer.time / 60);
    const initSeconds = Math.floor(unmodTimer.time % 60);

    settingsPopup.addSmallHeader('Settings');
    settingsPopup.addText('Duration (Minutes)');

    const minutes = settingsPopup.addInput(`${initMinutes}`);
    minutes.type = 'number';

    settingsPopup.addText('Duration (Seconds)');

    const seconds = settingsPopup.addInput(`${initSeconds}`);
    seconds.type = 'number';

    settingsPopup.addButton('Confirm Changes', 'blue', () => {
        const min = minutes.value == '' ? initMinutes : parseFloat(minutes.value);
        const sec = seconds.value == '' ? initSeconds : parseFloat(seconds.value);

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