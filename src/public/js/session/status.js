const socket = io();

const topBarText = document.getElementById('top-bar-text');
const name = document.getElementById('name');
function setName() {
    topBarText.textContent = `Status | ${committee.name}`;
    name.innerHTML = `<b>Name:</b> ${committee.name}`;
}

const agenda = document.getElementById('agenda');
function setAgenda() {
    agenda.innerHTML = `<b>Agenda:</b> ${committee.agenda}`;
}

const countries = document.getElementById('countries');
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
function setCurrentAction() {
    const action = committee.currentAction;
    currentAction.innerHTML = `<b>Current Action:</b> ${action.type.toUpperCase()}`;

    if (action.type === 'gsl' || action.type === 'unmod' || action.type === 'mod') {
        time.style.display = '';

        // const timer = new Timer(action.totalTime, time, undefined, undefined, false);
        timer.time = action.totalTime;
        timer.currentTime = action.currentTime;

        if (action.active) {
            const timeDifference = (Date.now() - action.actionTime) / 1000;
            timer.currentTime -= timeDifference;
            timer.play();
        } else {
            timer.pause();
            time.textContent = `${Timer.formatTime(timer.currentTime, 2, 2)} / ${Timer.formatTime(timer.time, 2, 2)}`;
        }
    } else {
        time.style.display = 'none';
    }
}

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
    }
});

setName();
setAgenda();
setCountries();
setCurrentAction();