const sessionPage = document.getElementById('session-page');
const sessionNavbar = document.getElementById('session-navbar');

const tabs = sessionNavbar.querySelectorAll('.btn');

const tabDocs = [];

// Push all the HTML pages for each tab to an array
for (const tab of tabs) {
    tabDocs.push(document.getElementById(tab.getAttribute('data-id')));
}

// The tab the page will, by default, render
const defaultTab = 'gsl';

const events = {};

// Assign an event to each tab that renders its page
for (const tab of tabs) {
    const name = tab.getAttribute('data-id');
    const page = document.getElementById(name);

    const event = () => {
        // Reset all tabs
        for (const t of tabs) {
            t.className = 'session-navbar-element';
        }

        // Set this page to be selected
        tab.className = 'session-navbar-element session-navbar-selected';

        // Hide all pages
        for (const page of tabDocs) {
            page.style.display = 'none';
        }

        // Show this page
        page.style.display = '';

        const action = {
            id: committee.id,
            type: name,
        }

        // Create an action to set the current action
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
            action['active'] = actionTimer.active;
        }

        setCurrentAction(action);
    }

    tab.addEventListener('click', event);

    if (tab.getAttribute('data-id') === defaultTab) {
        event();
    }

    events[name] = event;
}

/**
 * Sets the page
 * @param {*} name Name of the page to set to
 */
function setPage(name) {
    events[name]();
}