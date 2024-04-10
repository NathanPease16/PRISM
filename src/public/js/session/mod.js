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

let totalTimeOnPlay = 60;
const modTotalTimer = new Timer(60, modTotalTimeText, modPlayImage, modPauseImage);
const modTimer = new Timer(60, modTimeText, modPlayImage, modPauseImage);

const playModTimer = () => {
    modTotalTimer.play();
    setCurrentAction({ type: 'mod', totalTime: modTotalTimer.time, currentTime: modTotalTimer.currentTime, active: true });
}

const pauseModTimer = () => {
    modTotalTimer.pause();
    setCurrentAction({ type: 'mod', totalTime: modTotalTimer.time, currentTime: modTotalTimer.currentTime, active: false });
}

const resetModTimer = () => {
    modTotalTimer.pause();
    modTimer.reset();

    modTotalTimer.currentTime = totalTimeOnPlay;
    modTotalTimer.formatText();
    setCurrentAction({ type: 'mod', totalTime: modTotalTimer.time, currentTime: modTotalTimer.currentTime, active: false });
}

const resetModTimerAbsolute = () => {
    modTotalTimer.reset();
    setCurrentAction({ type: 'mod', totalTime: modTotalTimer.time, currentTime: modTotalTimer.currentTime, active: false });
}

const setModSpeakerText = () => {
    modSpeakers.textContent = `${modSpeakersList.length} / ${modTotalTimer.time / modTimer.time}`;
}

// All the logic to reload on attendance change (speaker's list data and what countries to render)
function loadMod() {
    modSpeakersList = [];

    setModSpeakerText();

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

    modCountrySelector = new CountrySelector('mod', unselected, selected);
    modCountrySelector.render();
};

loadMod();

setupSearch('mod');

modPlay.addEventListener('click', () => {
    if (!modTimer.active) {
        totalTimeOnPlay = modTotalTimer.currentTime;
        modTimer.play();
        playModTimer();

        const run = () => {
            if (!modTimer.active && modTotalTimer.active) {
                pauseModTimer();
            } else {
                requestAnimationFrame(run);
            }
        }

        run();
    } else {
        modTimer.pause();
        pauseModTimer();
    }
});

modNext.addEventListener('click', () => {
    const country = modSpeakersList[0];

    if (country) {
        modCountrySelector.unselect(country.title);
    }

    pauseModTimer();

    if (modTotalTimer.currentTime % 1 != 0) {
        modTotalTimer.setCurrentTime(Math.ceil(modTotalTimer.currentTime));
    }

    modTimer.reset();
});

modReset.addEventListener('click', () => {
    resetModTimer();
});

modSettings.addEventListener('click', () => {
    const modSettingsPopup = new Popup();
    
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

        if ((totalMin * 60 + totalSec) % (min * 60 + sec) != 0) {
            new Notification('Speaking time does not evenly divide into duration', 'red').show();
            return;
        }

        setMod(totalMin * 60 + totalSec, min * 60 + sec, topic);

        modSettingsPopup.remove();
    });

    modSettingsPopup.addButton('Cancel', 'red', () => {
        modSettingsPopup.remove();
    });

    modSettingsPopup.show();
});

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