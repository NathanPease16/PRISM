/**
 * Keeps track of all status updates received, disregarding
 * any status updates that do not pertain to the committee
 * being currently viewed. The socket listens for all updates,
 * and then calls the corresponding method based on what the
 * update is labeled as
 * 
 * @summary Keeps track of all status updates received
 * 
 * @author Nathan Pease
 */

const socket = io();

const topBarText = document.getElementById('top-bar-text');
const name = document.getElementById('name');

/**
 * Set the name display on the status page
 */
function setName() {
    topBarText.textContent = `Status | ${committee.name}`;
    name.innerHTML = `<b>Name:</b> ${committee.name}`;
}

const sessionModerator = document.getElementById('session-moderator');

/**
 * Set the current session moderator (based on whether or not there is one)
 */
function setCurrentSessionModerator() {
    if (!committee.sessionModerator) {
        sessionModerator.innerHTML = `<b>Session Moderator:</b>`;
    } else {
        const split = committee.sessionModerator.split('.');
        sessionModerator.innerHTML = `<b>Session Moderator:</b> ${split[0]} ${split[1]}`;
    }
}

const agenda = document.getElementById('agenda');

/**
 * Set agenda text
 */
function setAgenda() {
    agenda.innerHTML = `<b>Agenda:</b> ${committee.agenda}`;
}

const countries = document.getElementById('countries');

/**
 * Set all countries based on their attendance status
 */
function setCountries() {
    countries.innerHTML = '';
    for (const country of committee.countries) {
        instantiate('country', countries, {
            image: { src: `/global/flags/${country.flagCode.toLowerCase()}.png`},
            attendance: { class: `status-attendance-${country.attendance}` },
        }, {
            name: { textContent: country.title },
        });
    }
}

const currentAction = document.getElementById('current-action');
const time = document.getElementById('time');
const timer = new Timer(0, time, undefined, undefined, false);

/**
 * Set the current action and update any timers (if needed)
 */
function setCurrentAction() {
    const action = committee.currentAction;
    currentAction.innerHTML = `<b>Current Action:</b> ${action.type.toUpperCase()}`;

    // If the current action involves a timer, show the timer
    if (action.type === 'gsl' || action.type === 'unmod' || action.type === 'mod') {
        time.style.display = '';

        // Set the total time on the timer to the action's total time
        timer.time = action.totalTime;

        // Set the current time on the timer to the action's current time 
        // (for example, an action of type mod where the total time is
        // 60 seconds, but the current time is 55 seconds since they 
        // paused/unpaused it at that time)
        timer.currentTime = action.currentTime;

        // If the timer is active, account for the time difference between
        // when the action was taken and the current time, subtract it
        // from the current time, and then play the timer
        if (action.active) {
            const timeDifference = (Date.now() - action.actionTime) / 1000;
            timer.currentTime -= timeDifference;
            timer.play();
        // Otherwise pause the timer
        } else {
            timer.pause();
            time.textContent = `${Timer.formatTime(timer.currentTime, 2, 2)} / ${Timer.formatTime(timer.time, 2, 2)}`;
        }
    // Otherwise hide the timer
    } else {
        time.style.display = 'none';

        // If out of session, reset session moderator
        if (action.type === 'Out of Session') {
            committee.sessionModerator = '';
            setCurrentSessionModerator();
        }
    }
}

// When a session update is received, update
// the appropriate label
socket.on('sessionUpdate', (msg) => {
    if (msg.id != committee.id) {
        return;
    }

    if (msg.updateType === 'action') {
        committee.currentAction = msg;
        setCurrentAction();
    } else if (msg.updateType === 'agenda') {
        committee.agenda = msg.agenda;
        setAgenda();
    } else if (msg.updateType === 'attendance') {
        committee.countries = msg.countries;
        setCountries();
    } else if (msg.updateType === 'name') {
        committee.name = msg.name;
        setName();
    } else if (msg.updateType === 'moderating') {
        committee.sessionModerator = msg.sessionModerator;
        setCurrentSessionModerator();
    }
});

setName();
setAgenda();
setCountries();
setCurrentAction();
setCurrentSessionModerator();