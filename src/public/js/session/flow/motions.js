/**
 * Handles motions made by countries by ordering them
 * in order of most disruptive and least disruptive,
 * and also allowing for motions to easily be removed
 * if a mistake was made
 * 
 * @summary Handles motions made by countries
 * 
 * @author Nathan Pease
 */

const pass = document.getElementById('pass');
const fail = document.getElementById('fail');

const motionsDiv = document.getElementById('motions');
let motions = [];
let number = 0;

// :(
const modSubmit = document.getElementById('submit-mod-page');
const modTopic = document.getElementById('mod-topic');
const modDurMin = document.getElementById('mod-dur-min');
const modDurSec = document.getElementById('mod-dur-sec');
const modStMin = document.getElementById('mod-st-min');
const modStSec = document.getElementById('mod-st-sec');
const unmodSubmit = document.getElementById('submit-unmod-page');
const unmodDurMin = document.getElementById('unmod-min');
const unmodDurSec = document.getElementById('unmod-sec');
const customSubmit = document.getElementById('submit-custom-page');
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

// Add event listeners to all the tabs on the motions page
// that renders their specified tab
for (const motionTabButton of motionTabButtons) {
    const id = motionTabButton.getAttribute('data-page');
    const page = document.getElementById(id);

    motionTabButton.addEventListener('click', () => {
        for (const page of pages) {
            page.style = 'display: none;';
        }

        // Instead of creating multiple search bars for the submitting country
        // it removes the current one and adds it back into the document on the new
        // page and right before the submit button
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

/**
 * Completely reload the motions page
 */
const reloadMotions = () => {
    motionsDiv.innerHTML = '';

    // Sort the motions in order of most disruptive
    // to least disruptive:
    // MOST DISRUPTIVE
    // Custom
    //      Ordered by duration
    //      Ordered by submission order
    // Unmod
    //      Ordered by duration
    //      Ordered by submission order
    // Mod
    //      Ordered by duration
    //      Ordered by number of speakers
    //      Ordered by submission order
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

    // Loop through all motions currently in the motions list
    // and add them to the document using templates.js
    for (const motion of motions) {
        instantiate(motion.type, motionsDiv, {
            flag: { src: `/global/flags/${motion.country.flagCode.toLowerCase()}.png`},
            delete: { id: motion.number },
        }, {
            name: { textContent: motion.country.title },
            topic: { innerHTML: `<b>Topic: </b> ${motion.topic}` },
            duration: { innerHTML: `<b>Duration: </b> ${Timer.formatTime(motion.duration, 2, 2)}` },
            speakingTime: { innerHTML: `<b>Speaking Time: </b> ${Timer.formatTime(motion.speakingTime, 2, 2)}` },
            speakers: { innerHTML: `<b>Speakers: </b> ${motion.speakers}` },
        });

        // Add a button that removes the motion from the list
        const x = document.getElementById(`${motion.number}`);

        x.addEventListener('click', () => {
            motions.splice(motions.indexOf(motion), 1);

            reloadMotions();
        });
    }
}

/**
 * Checks the value of the input element and sets the
 * submitting country variable to reflect the first
 * country that comes up
 */
const setSubmittingCountryInput = () => {
    const input = submittingCountryInput.value;
    let foundOne = false;

    // Go through all countries
    for (const country of countries) {
        // Check to see if the title matches
        const title = country.title.toLowerCase().startsWith(input.toLowerCase());

        // Check to see if any of the alternatives match (ex. Ivory Coast for Cote D'Ivoire)
        let alternative = false;
        for (const alternate of country.alternatives) {
            if (alternate.toLowerCase().startsWith(input.toLowerCase())) {
                alternative = true;
            }
        }

        // If the title or an alternative match the input, set the submitting country
        // to that country
        if (title || alternative) {
            submittingCountryImg.src = `/global/flags/${country.flagCode.toLowerCase()}.png`;
            submittingCountryText.textContent = country.title;
            currentCountry = country;
            foundOne = true;
            break;
        }
    }

    // If one isn't found, set the images to a default
    if (!foundOne) {
        submittingCountryImg.src = '/global/flags/xx.png';
        submittingCountryText.textContent = '';
        currentCountry = { title: '', flagCode: 'xx' };
    }
}

// Set the submitting country when text is input in the
// input field
submittingCountryInput.addEventListener('input', () => {
    setSubmittingCountryInput();
});

// Submit the motion for a mod
modSubmit.addEventListener('click', () => {
    const motion = { type: 'mod', country: currentCountry };

    // Get relevant information for a moderated caucus
    motion.topic = modTopic.value;
    motion.duration = (modDurMin.value ? parseFloat(modDurMin.value) * 60 : 0) + (modDurSec.value ? parseFloat(modDurSec.value) : 0);
    motion.speakingTime = (modStMin.value ? parseFloat(modStMin.value) * 60 : 0) + (modStSec.value ? parseFloat(modStSec.value) : 0);

    // Make sure speaking time divides into duration
    if (motion.duration % motion.speakingTime != 0) {
        new Notification('Speaking time does not evenly divide into duration', 'red').show();
        return;
    }

    // Assign information to the motion and push it to the list of
    // all motions
    motion.speakers = motion.duration / motion.speakingTime;
    motion.number = number;

    motions.push(motion);

    // Reset forms on the field
    for (const e of [modTopic, modDurMin, modDurSec, modStMin, modStSec, submittingCountryInput]) {
        e.value = '';
    }

    // Reload page
    number++;
    reloadMotions();
    setSubmittingCountryInput();
});

// Submit the motion for an unmod
unmodSubmit.addEventListener('click', () => {
    const motion = { type: 'unmod', country: currentCountry };
    
    // Get the relevant information
    motion.duration = (unmodDurMin.value ? parseFloat(unmodDurMin.value) * 60 : 0) + (unmodDurSec.value ? parseFloat(unmodDurSec.value) : 0);
    motion.number = number;

    // Push to the list of motions
    motions.push(motion);

    // Reset elements
    for (const e of [unmodDurMin, unmodDurSec, submittingCountryInput]) {
        e.value = '';
    }

    number++;
    reloadMotions();
    setSubmittingCountryInput();
});

// Submit custom motion
customSubmit.addEventListener('click', () => {
    const motion = { type: 'custom', country: currentCountry };

    // Get relevant info
    motion.topic = customTopic.value;
    motion.duration = (customDurMin.value ? parseFloat(customDurMin.value) * 60 : 0) + (customDurSec.value ? parseFloat(customDurSec.value) : 0);
    motion.number = number;

    // Push to list
    motions.push(motion);

    // Reset elements
    for (const e of [customTopic, customDurMin, customDurSec, submittingCountryInput]) {
        e.value = '';
    }

    number++;
    reloadMotions();
    setSubmittingCountryInput();
});

// Removes all motions and routes the user to the proper
// page depending on what kind of motion they passed
pass.addEventListener('click', () => {
    const passed = motions[0];
    motions = [];

    // Reload all motions after emptying
    reloadMotions();

    // Route to unmod page of 'unmod' or 'custom' is passed,
    // otherwise route to the mod page
    if (passed.type === 'unmod' || passed.type === 'custom') {
        setUnmodTime(passed.duration);
        setPage('unmod');
    } else if (passed.type === 'mod') {
        setMod(passed.duration, passed.speakingTime, passed.topic);
        setPage('mod');
    }
});

// Remove the top motion and reload
fail.addEventListener('click', () => {       
    motions.shift();

    reloadMotions();
});

reloadMotions();
setSubmittingCountryInput();