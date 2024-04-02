function main() {
    const search = document.getElementById('search');
    const countriesDiv = document.getElementById('add-speakers-countries');
    const currentSpeakerDiv = document.getElementById('current-speaker');
    const speakersListDiv = document.getElementById('speakers-list');

    const timeText = document.getElementById('time');

    const play = document.getElementById('play');
    const next = document.getElementById('next');

    const playImage = document.getElementById('play-img');
    const pauseImage = document.getElementById('pause-img');

    let speakersListTime = 60;
    let speakTimeFormatted = formatTime(speakersListTime, 2, 2, 0);
    currentTime = speakersListTime;

    let timerActive = false;

    const id = window.location.pathname.split('/')[2];

    let speakersList = [];

    (async () => {
        const allCommittees = await committees;

        let countries;
        for (const c of allCommittees.data) {
            if (c.id == id) {
                countries = c.countries;
                break;
            }
        }

        const loadCountries = (searchValue) => {
            countriesDiv.innerHTML = '';
            speakersListDiv.innerHTML = '';
            currentSpeakerDiv.innerHTML = '';

            const addCountry = (c, appendTo, event) => {
                const div = document.createElement('div');
                div.className = 'country';

                const p = document.createElement('p');
                p.textContent = c.title;

                const img = document.createElement('img');
                img.src = `/global/flags/${c.flagCode.toLowerCase()}.png`;

                div.appendChild(img);
                div.appendChild(p);

                div.addEventListener('click', event);

                appendTo.appendChild(div);
            }

            for (const country of speakersList) {
                const event = () => {
                    speakersList = speakersList.filter((speaker) => speaker.title != country.title);
                    timerActive = false;
                    currentTime = speakersListTime;

                    const formattedTime = formatTime(currentTime, 2, 2, 0);
                    timeText.textContent = `${formattedTime} / ${speakTimeFormatted}`;

                    playImage.style = '';
                    pauseImage.style = 'display: none;';

                    loadCountries('');
                };

                if (country.title == speakersList[0].title) {
                    addCountry(country, currentSpeakerDiv, event);
                } else {
                    addCountry(country, speakersListDiv, event);
                }
            }

            for (const country of countries) {
                const filteredSpeakers = speakersList.filter((speaker) => speaker.title == country.title);

                if (filteredSpeakers.length > 0) {
                    continue;
                }

                const e = () => {
                    speakersList.push(country);
                    loadCountries('');
                }

                if (country.title.toLowerCase().startsWith(searchValue.toLowerCase()) || country.code.startsWith(searchValue)) {
                    addCountry(country, countriesDiv, e);
                    continue;
                }

                for (alternative of country.alternatives) {
                    if (alternative.toLowerCase().startsWith(searchValue.toLowerCase())) {
                        addCountry(country, countriesDiv, e);
                    }
                }
            }
        }

        search.addEventListener('input', () => {
            loadCountries(search.value);
        });

        play.addEventListener('click', () => {
            lastTime = Date.now();

            if (!timerActive) {
                pauseImage.style = '';
                playImage.style = 'display: none;';
                timerActive = true;

                const run = () => {
                    if (timerActive) {
                        updateTimer();
                        const formattedTime = formatTime(currentTime, 2, 2, 0);

                        timeText.textContent = `${formattedTime} / ${speakTimeFormatted}`;

                        if (currentTime > 0) {
                            requestAnimationFrame(run);
                        } else {
                            playImage.style = '';
                            pauseImage.style = 'display: none;';
                            timerActive = false;
                        }
                    }
                }
                
                run();
            } else {
                playImage.style = '';
                pauseImage.style = 'display: none;';
                timerActive = false;
            }
        });

        next.addEventListener('click', () => {
            speakersList.shift();
            
            timerActive = false;
            currentTime = speakersListTime;

            const formattedTime = formatTime(currentTime, 2, 2, 0);
            timeText.textContent = `${formattedTime} / ${speakTimeFormatted}`;

            playImage.style = '';
            pauseImage.style = 'display: none;';

            loadCountries('');
        });

        loadCountries('');
    })();
}

main();