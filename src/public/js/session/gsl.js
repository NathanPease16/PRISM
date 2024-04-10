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

const timer = new Timer(60, timeText, playImage, pauseImage);

const updateSpeakersText = () => {
    totalSpeakers.textContent = `Speakers List | ${speakersList.length}`;
}

const playTimer = () => {
    timer.play();
    setCurrentAction({ ...getLastAction(), totalTime: timer.time, currentTime: timer.currentTime, active: true });
}

const pauseTimer = () => {
    timer.pause();
    setCurrentAction({ ...getLastAction(), totalTime: timer.time, currentTime: timer.currentTime, active: false });
}

const resetTimer = () => {
    timer.reset();
    setCurrentAction({ ...getLastAction(), totalTime: timer.time, currentTime: timer.currentTime, active: false });
}

// All the logic to reload on attendance change (speaker's list data and what countries to render)
function loadGSL() {
    speakersList = [];

    updateSpeakersText();

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

    const selected = {
        countries: speakersList,
        parent: selectedCountries,
        sort: (a, b) => 0,
        beforeEvent: (country) => {
            if (speakersList.length > 0 && country.title === speakersList[0].title) {
                // timer.reset();
                resetTimer();
            }
        },
        afterEvent: updateSpeakersText,
    }

    countrySelector = new CountrySelector('gsl', unselected, selected);
    countrySelector.render();
};

loadGSL();

setupSearch('gsl');

play.addEventListener('click', () => {
    if (!timer.active) {
        // timer.play();
        playTimer();
    } else {
        pauseTimer();
        // timer.pause();
    }
});

next.addEventListener('click', () => {
    const country = speakersList[0];

    if (country) {
        countrySelector.unselect(country.title);
    }

    // timer.reset();
    resetTimer();
});

reset.addEventListener('click', () => {
    // timer.reset();
    resetTimer();
});

settings.addEventListener('click', () => {
    const settingsPopup = new Popup();
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
        if (minutes.value === '' && seconds.value === '') {
            min = initMinutes;
            sec = initSeconds;
        } else {
            min = minutes.value == '' ? 0 : parseFloat(minutes.value);
            sec = seconds.value == '' ? 0 : parseFloat(seconds.value);
        }

        timer.setTime(min * 60 + sec);
        // timer.reset();
        resetTimer();

        settingsPopup.remove();
    });

    settingsPopup.addButton('Cancel', 'red', () => {
        settingsPopup.remove();
    });

    settingsPopup.show();
});