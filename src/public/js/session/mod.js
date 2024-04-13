// Elements in the document needed for the mod
const modUnselectedCountries = document.getElementById('mod-unselected-countries');
const modSelectedCountries = document.getElementById('mod-selected-countries');

const modSettings = document.getElementById('mod-settings');
const modPlay = document.getElementById('mod-play');
const modReset = document.getElementById('mod-reset');
const modNext = document.getElementById('mod-next');

const modPlayImage = document.getElementById('mod-play-img');
const modPauseImage = document.getElementById('mod-pause-img');

const modTotalTimeText = document.getElementById('mod-total-time');
const modTimeText = document.getElementById('mod-time');

const modTopicText = document.getElementById('mod-topic-text');
const modSpeakers = document.getElementById('mod-speakers');

let modSpeakersList = [];

let modCountrySelector;
let topic = '';

// Create 2 timers, one for the total time, and one for individual speaking time
let totalTimeOnPlay = 60;
let hasReset = true;
const modTotalTimer = new Timer(60, modTotalTimeText, modPlayImage, modPauseImage);
const modTimer = new Timer(60, modTimeText, modPlayImage, modPauseImage);

/**
 * Play the total mod timer and set the current action
 */
const playModTimer = () => {
    modTotalTimer.play();
    setCurrentAction({ type: 'mod', totalTime: modTotalTimer.time, currentTime: modTotalTimer.currentTime, active: true });
}

/**
 * Pause total mod timer and set current action
 */
const pauseModTimer = () => {
    modTotalTimer.pause();
    setCurrentAction({ type: 'mod', totalTime: modTotalTimer.time, currentTime: modTotalTimer.currentTime, active: false });
}

/**
 * Reset total mod timer based on the mod timer and set the current action
 */
const resetModTimer = () => {
    hasReset = true;

    // Pause the total mod timer and reset the mod timer
    modTotalTimer.pause();
    modTimer.reset();

    // Set the mod total timer to the time it was at
    // when it first started playing, format its text,
    // and set the current action
    modTotalTimer.currentTime = totalTimeOnPlay;
    modTotalTimer.formatText();
    setCurrentAction({ type: 'mod', totalTime: modTotalTimer.time, currentTime: modTotalTimer.currentTime, active: false });
}

/**
 * Reset the total mod timer completely and set the current action
 */
const resetModTimerAbsolute = () => {
    hasReset = true;
    modTotalTimer.reset();
    setCurrentAction({ type: 'mod', totalTime: modTotalTimer.time, currentTime: modTotalTimer.currentTime, active: false });
}

/**
 * Set speaker text to reflect the number of speakers compared
 * to the possible number of speakers
 */
const setModSpeakerText = () => {
    modSpeakers.textContent = `${modSpeakersList.length} / ${modTotalTimer.time / modTimer.time}`;
}

// All the logic to reload on attendance change (speaker's list data and what countries to render)
function loadMod() {
    modSpeakersList = [];

    setModSpeakerText();

    // Parameters for unselected (see countrySelection.js)
    const unselected = {
        // Create a shallow copy of the countries array to make sure it doesn't overlap with gsl
        countries: [...countries],
        parent: modUnselectedCountries,
        sort: (a, b) => {
            const titleA = a.title.toLowerCase();
            const titleB = b.title.toLowerCase();
            if (titleA > titleB) {
                return 1;
            } else if (titleA < titleB) {
                return -1;
            } else {
                return 0;
            }
        },
        afterEvent: setModSpeakerText,
    }

    // Parameters for selected (see countrySelection.js)
    const selected = {
        countries: modSpeakersList,
        parent: modSelectedCountries,
        sort: (a, b) => 0,
        beforeEvent: (country) => {
            if (modSpeakersList.length > 0 && country.title === modSpeakersList[0].title) {
                pauseModTimer();
    
                if (modTotalTimer.currentTime % 1 != 0) {
                    modTotalTimer.setCurrentTime(Math.ceil(modTotalTimer.currentTime));
                }

                modTimer.reset();
            }
        },
        afterEvent: setModSpeakerText,
    }

    // Create new country selector & render
    modCountrySelector = new CountrySelector('mod', unselected, selected);
    modCountrySelector.render();
};

loadMod();

setupSearch('mod');

// Play the mod timer if paused, pause if playing
modPlay.addEventListener('click', () => {
    if (!modTimer.active) {
        // Set time on play ONLY if it is directly after 
        // a reset, as if it sets every time the user
        // plays the timer then it can get off if they
        // pause it and then play it again
        if (hasReset) {
            totalTimeOnPlay = modTotalTimer.currentTime;
            hasReset = false;
        }

        // Play the mod timer and total timer
        modTimer.play();
        playModTimer();

        // Constantly check to make sure the mod timer isn't paused
        const run = () => {
            if (!modTimer.active && modTotalTimer.active) {
                pauseModTimer();
            } else {
                requestAnimationFrame(run);
            }
        }

        run();
    // Pause the timers
    } else {
        modTimer.pause();
        pauseModTimer();
    }
});

// Move on to the next country in the list of speakers
modNext.addEventListener('click', () => {
    const country = modSpeakersList[0];

    if (country) {
        modCountrySelector.unselect(country.title);
    }

    pauseModTimer();

    // Since time is rendered by rounding up to the nearest
    // second (meaning 59.01 seconds is display as 01:00), the
    // mod total timer needs to be rounded up to stay in sync
    // with the individual speaking time timer
    modTotalTimer.setCurrentTime(Math.ceil(modTotalTimer.currentTime));

    modTimer.reset();
});

// Reset the mod timer
modReset.addEventListener('click', () => {
    resetModTimer();
});

// Open a settings menu to modify the mod
modSettings.addEventListener('click', () => {
    const modSettingsPopup = new Popup();

    // Get initial times for total time and individual speaking time
    const initTotalMinutes = Math.floor(modTotalTimer.time / 60);
    const initTotalSeconds = Math.floor(modTotalTimer.time % 60);

    const initMinutes = Math.floor(modTimer.time / 60);
    const initSeconds = Math.floor(modTimer.time % 60);

    modSettingsPopup.addSmallHeader('Settings');

    modSettingsPopup.addText('Topic');
    const topicInput = modSettingsPopup.addInput('Topic');

    modSettingsPopup.addText('Total Time');
    const totalMinutes = modSettingsPopup.addInput(`Minutes`);
    totalMinutes.type = 'number';
    const totalSeconds = modSettingsPopup.addInput(`Seconds`);
    totalSeconds.type = 'number';

    modSettingsPopup.addText('Speaking Time');
    const minutes = modSettingsPopup.addInput(`Minutes`);
    minutes.type = 'number';
    const seconds = modSettingsPopup.addInput(`Seconds`);
    seconds.type = 'number';

    modSettingsPopup.addButton('Confirm Changes', 'blue', () => {
        topic = topicInput.value == '' ? topic : topicInput.value;

        let totalMin;
        let totalSec;

        // If times are unchanged set to original values, otherwise
        // assign them to the value they were changed to
        if (totalMinutes.value === '' && totalSeconds.value === '') {
            totalMin = initTotalMinutes;
            totalSec = initTotalSeconds;
        } else {
            totalMin = totalMinutes.value == '' ? 0 : parseFloat(totalMinutes.value);
            totalSec = totalSeconds.value == '' ? 0 : parseFloat(totalSeconds.value);
        }

        let min;
        let sec;
        if (minutes.value === '' && seconds.value === '') {
            min = initMinutes;
            sec = initSeconds;
        } else {
            min = minutes.value == '' ? 0 : parseFloat(minutes.value);
            sec = seconds.value == '' ? 0 : parseFloat(seconds.value);
        }

        // Make sure given time divides evenly
        if ((totalMin * 60 + totalSec) % (min * 60 + sec) != 0) {
            new Notification('Speaking time does not evenly divide into duration', 'red').show();
            return;
        }

        // Set the mod's time
        setMod(totalMin * 60 + totalSec, min * 60 + sec, topic);

        modSettingsPopup.remove();
    });

    modSettingsPopup.addButton('Cancel', 'red', () => {
        modSettingsPopup.remove();
    });

    modSettingsPopup.show();
});

/**
 * Set the mod's total time, speaking time, and topic
 * @param {*} totalTime 
 * @param {*} speakingTime 
 * @param {*} t 
 */
function setMod(totalTime, speakingTime, t) {
    topic = t;

    modTotalTimer.setTime(totalTime);
    modTimer.setTime(speakingTime);

    modTopicText.textContent = `Topic: ${topic}`;

    setModSpeakerText();

    resetModTimerAbsolute();
    modTimer.reset();

    loadMod();
}