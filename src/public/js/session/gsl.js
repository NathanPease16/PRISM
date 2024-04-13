// Get needed elements from the document
const unselectedCountries = document.getElementById('unselected-countries');
const selectedCountries = document.getElementById('selected-countries');

const settings = document.getElementById('settings');
const play = document.getElementById('play');
const reset = document.getElementById('reset');
const next = document.getElementById('next');

const playImage = document.getElementById('play-img');
const pauseImage = document.getElementById('pause-img');

const timeText = document.getElementById('time');

const totalSpeakers = document.getElementById('total-speakers');

let speakersList = [];

let countrySelector;

// Create a new time with a default time of 60 seconds
const timer = new Timer(60, timeText, playImage, pauseImage);

/**
 * Updates the speaker's list text to reflect the number of speakers
 */
const updateSpeakersText = () => {
    totalSpeakers.textContent = `Speakers List | ${speakersList.length}`;
}

/**
 * Plays the timer and sets the current action to be on the GSL and with an active timer
 */
const playTimer = () => {
    timer.play();
    setCurrentAction({ type: 'gsl', totalTime: timer.time, currentTime: timer.currentTime, active: true });
}

/**
 * Pauses the timer and sets the current action to be GSL with a paused timer
 */
const pauseTimer = () => {
    timer.pause();
    setCurrentAction({ type: 'gsl', totalTime: timer.time, currentTime: timer.currentTime, active: false });
}

/**
 * Resets the timer and sets current action to GSL w/ paused timer
 */
const resetTimer = () => {
    timer.reset();
    setCurrentAction({ type: 'gsl', totalTime: timer.time, currentTime: timer.currentTime, active: false });
}

/**
 * Loads the actual GSL itself
 */
function loadGSL() {
    // Set empty speakers list
    speakersList = [];

    // Update speakers text to reflect 0 speakers
    updateSpeakersText();

    // Parameters for unselected countries in the country selector (countrySelection.js)
    const unselected = {
        countries: [...countries],
        parent: unselectedCountries,
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
        afterEvent: updateSpeakersText,
    }

    // Parameters for selected countries in the country selector (countrySelection.js)
    const selected = {
        countries: speakersList,
        parent: selectedCountries,
        sort: (a, b) => 0,
        beforeEvent: (country) => {
            if (speakersList.length > 0 && country.title === speakersList[0].title) {
                resetTimer();
            }
        },
        afterEvent: updateSpeakersText,
    }

    // Create a new country selector and render it
    countrySelector = new CountrySelector('gsl', unselected, selected);
    countrySelector.render();
};

// Load the GSL
loadGSL();

// Set up the searchbar using search.js
setupSearch('gsl');

// Play timer if paused, pause timer if playing
play.addEventListener('click', () => {
    if (!timer.active) {
        playTimer();
    } else {
        pauseTimer();
    }
});

// Moves on to the next country in the speakers
// list and resets the timer
next.addEventListener('click', () => {
    const country = speakersList[0];

    if (country) {
        countrySelector.unselect(country.title);
    }

    resetTimer();
});

// Resets the timer
reset.addEventListener('click', () => {
    resetTimer();
});

// Creates a settings menu popup to modify the speaking time
settings.addEventListener('click', () => {
    const settingsPopup = new Popup();

    // Get initial time (before changes)
    const initMinutes = Math.floor(timer.time / 60);
    const initSeconds = Math.floor(timer.time % 60);

    settingsPopup.addSmallHeader('Settings');
    settingsPopup.addText('Speaking Time');

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

        // Set the timer's time and reset the timer
        timer.setTime(min * 60 + sec);
        resetTimer();

        settingsPopup.remove();
    });

    settingsPopup.addButton('Cancel', 'red', () => {
        settingsPopup.remove();
    });

    settingsPopup.show();
});