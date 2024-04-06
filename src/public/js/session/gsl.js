(() => {
    const unselectedCountries = document.getElementById('unselected-countries');
    const selectedCountries = document.getElementById('selected-countries');

    let speakingTime = 60;
    currentTime = speakingTime;
    let timerActive = false;

    const settings = document.getElementById('settings');
    const play = document.getElementById('play');
    const next = document.getElementById('next');

    const playImage = document.getElementById('play-img');
    const pauseImage = document.getElementById('pause-img');

    const timeText = document.getElementById('time');

    const totalSpeakers = document.getElementById('total-speakers');

    const speakersList = [];

    const updateSpeakersText = () => {
        totalSpeakers.textContent = `Speakers List | ${speakersList.length}`;
    }

    updateSpeakersText();

    const pauseTime = () => {
        playImage.style = '';
        pauseImage.style = 'display: none;';
        timerActive = false;
    }

    const resetTime = () => {
        pauseTime();

        currentTime = speakingTime;
        timeText.textContent = `${formatTime(currentTime, 2, 2)} / ${formatTime(speakingTime, 2, 2)}`;
    }

    countrySelector(countries, speakersList, 
        { parent: unselectedCountries, event: updateSpeakersText }, 
        { parent: selectedCountries, sort: false, event: (selected) => {
            const name = selected.id.split('-')[0];
            if (name == speakersList[0].title) {
                resetTime();
            }

            updateSpeakersText();
        } });

    setupSearch(countries, speakersList);

    play.addEventListener('click', () => {
        lastTime = Date.now();

        if (!timerActive) {
            pauseImage.style = '';
            playImage.style = 'display: none;';
            timerActive = true;

            const run = () => {
                if (timerActive) {
                    updateTimer();

                    timeText.textContent = `${formatTime(currentTime, 2, 2)} / ${formatTime(speakingTime, 2, 2)}`;

                    if (currentTime > 0) {
                        requestAnimationFrame(run);
                    } else {
                        pauseTime();
                    }
                }
            }
            
            run();
        } else {
            pauseTime();
        }
    });

    next.addEventListener('click', () => {
        const country = speakersList[0];

        if (country) {
            executeSelected(country.title);
        }

        resetTime();
    });

    settings.addEventListener('click', () => {
        const settingsPopup = new Popup();
        const initMinutes = Math.floor(speakingTime / 60);
        const initSeconds = Math.floor(speakingTime % 60);

        settingsPopup.addSmallHeader('Settings');
        settingsPopup.addText('Speaking Time (Minutes)');

        const minutes = settingsPopup.addInput(`${initMinutes}`);
        minutes.type = 'number';

        settingsPopup.addText('Speaking Time (Seconds)');

        const seconds = settingsPopup.addInput(`${initSeconds}`);
        seconds.type = 'number';

        settingsPopup.addButton('Confirm Changes', 'blue', () => {
            pauseTime();

            const min = minutes.value == '' ? initMinutes : parseFloat(minutes.value);
            const sec = seconds.value == '' ? initSeconds : parseFloat(seconds.value);

            speakingTime = min * 60 + sec;
            resetTime();

            settingsPopup.remove();
        });

        settingsPopup.addButton('Cancel', 'red', () => {
            settingsPopup.remove();
        });

        settingsPopup.show();
    });
})();