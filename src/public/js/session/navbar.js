const sessionPage = document.getElementById('session-page');
const sessionNavbar = document.getElementById('session-navbar');

const tabs = sessionNavbar.querySelectorAll('.btn');

const tabDocs = [];

for (const tab of tabs) {
    tabDocs.push(document.getElementById(tab.getAttribute('data-id')));
}

const defaultTab = 'gsl';

let previousScripts;

for (const tab of tabs) {
    const page = document.getElementById(tab.getAttribute('data-id'));

    const event = () => {
        for (const t of tabs) {
            t.className = 'session-navbar-element';
        }

        tab.className = 'session-navbar-element session-navbar-selected';

        for (const page of tabDocs) {
            page.style.display = 'none';
        }

        page.style.display = '';
    }

    tab.addEventListener('click', event);

    if (tab.getAttribute('data-id') === defaultTab) {
        event();
    }
}