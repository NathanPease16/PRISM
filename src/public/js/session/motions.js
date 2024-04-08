const pass = document.getElementById('pass');
const fail = document.getElementById('fail');

const motionsDiv = document.getElementById('motions');
let motions = [];
let number = 0;

// Buttons and values for moderated caucus
const modSubmit = document.getElementById('submit-mod');
const modTopic = document.getElementById('mod-topic');
const modDurMin = document.getElementById('mod-dur-min');
const modDurSec = document.getElementById('mod-dur-sec');
const modStMin = document.getElementById('mod-st-min');
const modStSec = document.getElementById('mod-st-sec');

// Buttons and values for unmoderated caucus
const unmodSubmit = document.getElementById('submit-unmod');
const unmodDurMin = document.getElementById('unmod-min');
const unmodDurSec = document.getElementById('unmod-sec');

// Buttons and values for custom caucus
const customSubmit = document.getElementById('submit-custom');
const customTopic = document.getElementById('custom-topic');
const customDurMin = document.getElementById('custom-min');
const customDurSec = document.getElementById('custom-sec');

const motionTabButtons = document.querySelectorAll('.motion-nav-button');
const pages = document.querySelectorAll('.motion-page');

const submittingCountry = document.getElementById('submitting-country');
const submittingCountryInput = document.getElementById('submitting-country-input');
const submittingCountryImg = document.getElementById('submitting-country-img');
const submittingCountryText = document.getElementById('submitting-country-text');
let currentCountry = { title: '', flagCode: 'xx' };

for (const motionTabButton of motionTabButtons) {
    const id = motionTabButton.getAttribute('data-page');
    const page = document.getElementById(id);

    motionTabButton.addEventListener('click', () => {
        for (const page of pages) {
            page.style = 'display: none;';
        }

        submittingCountry.remove();
        page.style = '';
        submittingCountry.style.display = '';
        page.insertBefore(submittingCountry, document.getElementById(`submit-${id}`));

        for (const motionTabButton of motionTabButtons) {
            motionTabButton.className = 'motion-nav-button';
        }

        motionTabButton.classList.add('motion-nav-button-active');
    });
}

const reloadMotions = () => {
    motionsDiv.innerHTML = '';

    motions = motions.sort((a, b) => {
        if ((a.type === 'custom' && b.type !== 'custom') || (a.type === 'unmod' && b.type === 'mod')) {
            return -1;
        } else if ((a.type === 'custom' && b.type === 'custom') || (a.type === 'unmod' && b.type === 'unmod')) {
            return b.duration - a.duration;
        } else if (a.type === 'mod' && b.type === 'mod') {
            if (b.duration - a.duration != 0) {
                return b.duration - a.duration;
            } else {
                return b.speakers - a.speakers;
            }
        } else {
            return 0;
        }
    });

    for (const motion of motions) {
        instantiate(motion.type, motionsDiv, {
            flag: { src: `/global/flags/${motion.country.flagCode.toLowerCase()}.png`},
            delete: { id: motion.number },
        }, {
            name: { textContent: motion.country.title },
            topic: { innerHTML: `<b>Topic: </b> ${motion.topic}` },
            duration: { innerHTML: `<b>Duration: </b> ${formatTime(motion.duration, 2, 2)}` },
            speakingTime: { innerHTML: `<b>Speaking Time: </b> ${formatTime(motion.speakingTime, 2, 2)}` },
            speakers: { innerHTML: `<b>Speakers: </b> ${motion.speakers}` },
        });

        const x = document.getElementById(`${motion.number}`);

        x.addEventListener('click', () => {
            motions.splice(motions.indexOf(motion), 1);

            reloadMotions();
        });
    }
}

const setSubmittingCountryInput = () => {
    const input = submittingCountryInput.value;
    let foundOne = false;

    for (const country of countries) {
        const title = country.title.toLowerCase().startsWith(input.toLowerCase());

        let alternative = false;
        for (const alternate of country.alternatives) {
            if (alternate.toLowerCase().startsWith(input.toLowerCase())) {
                alternative = true;
            }
        }

        if (title || alternative) {
            submittingCountryImg.src = `/global/flags/${country.flagCode.toLowerCase()}.png`;
            submittingCountryText.textContent = country.title;
            currentCountry = country;
            foundOne = true;
            break;
        }
    }

    if (!foundOne) {
        submittingCountryImg.src = '/global/flags/xx.png';
        submittingCountryText.textContent = '';
        currentCountry = { title: '', flagCode: 'xx' };
    }
}

submittingCountryInput.addEventListener('input', () => {
    setSubmittingCountryInput();
});

modSubmit.addEventListener('click', () => {
    const motion = { type: 'mod', country: currentCountry };

    motion.topic = modTopic.value;
    motion.duration = (modDurMin.value ? parseFloat(modDurMin.value) * 60 : 0) + (modDurSec.value ? parseFloat(modDurSec.value) : 0);
    motion.speakingTime = (modStMin.value ? parseFloat(modStMin.value) * 60 : 0) + (modStSec.value ? parseFloat(modStSec.value) : 0);

    if (motion.duration % motion.speakingTime != 0) {
        new Notification('Speaking time does not evenly divide into duration', 'red').show();
        return;
    }

    motion.speakers = motion.duration / motion.speakingTime;
    motion.number = number;

    motions.push(motion);

    for (const e of [modTopic, modDurMin, modDurSec, modStMin, modStSec, submittingCountryInput]) {
        e.value = '';
    }

    number++;
    reloadMotions();
    setSubmittingCountryInput();
});

unmodSubmit.addEventListener('click', () => {
    const motion = { type: 'unmod', country: currentCountry };
    
    motion.duration = (unmodDurMin.value ? parseFloat(unmodDurMin.value) * 60 : 0) + (unmodDurSec.value ? parseFloat(unmodDurSec.value) : 0);
    motion.number = number;

    motions.push(motion);

    for (const e of [unmodDurMin, unmodDurSec, submittingCountryInput]) {
        e.value = '';
    }

    number++;
    reloadMotions();
    setSubmittingCountryInput();
});

customSubmit.addEventListener('click', () => {
    const motion = { type: 'custom', country: currentCountry };

    motion.topic = customTopic.value;
    motion.duration = (customDurMin.value ? parseFloat(customDurMin.value) * 60 : 0) + (customDurSec.value ? parseFloat(customDurSec.value) : 0);
    motion.number = number;

    motions.push(motion);

    for (const e of [customTopic, customDurMin, customDurSec, submittingCountryInput]) {
        e.value = '';
    }

    number++;
    reloadMotions();
    setSubmittingCountryInput();
});

pass.addEventListener('click', () => {
    const passed = motions[0];
    motions = [];

    if (passed) {
        console.log(passed);
    }

    reloadMotions();
});

fail.addEventListener('click', () => {       
    motions.shift();

    reloadMotions();
});

reloadMotions();
setSubmittingCountryInput();