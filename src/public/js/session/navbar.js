const sessionPage = document.getElementById('session-page');
const sessionNavbar = document.getElementById('session-navbar');

const tabs = sessionNavbar.querySelectorAll('.btn');

const tabDocs = [];

for (const tab of tabs) {
    tabDocs.push(document.getElementById(tab.getAttribute('data-id')));
}

const defaultTab = 'gsl';

let previousScripts;

const events = {};

for (const tab of tabs) {
    const name = tab.getAttribute('data-id');
    const page = document.getElementById(name);

    const event = () => {
        for (const t of tabs) {
            t.className = 'session-navbar-element';
        }

        tab.className = 'session-navbar-element session-navbar-selected';

        for (const page of tabDocs) {
            page.style.display = 'none';
        }

        page.style.display = '';

        const action = {
            id: committee.id,
            type: name,
        }

        if (name === 'mod' || name === 'unmod' || name === 'gsl') {
            let actionTimer;
            if (name === 'mod') {
                actionTimer = modTotalTimer;
            } else if (name === 'unmod') {
                actionTimer = unmodTimer;
            } else {
                actionTimer = timer;
            }

            action['totalTime'] = actionTimer.time;
            action['currentTime'] = actionTimer.currentTime;
            action['active'] = false;
        }

        setCurrentAction(action);
    }

    tab.addEventListener('click', event);

    if (tab.getAttribute('data-id') === defaultTab) {
        event();
    }

    events[name] = event;
}

function setPage(name) {
    events[name]();
}