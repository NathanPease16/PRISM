const sessionPage = document.getElementById('session-page');
const sessionNavbar = document.getElementById('session-navbar');

const tabs = sessionNavbar.getElementsByTagName('div');

const defaultTab = 'gsl';

for (const tab of tabs) {
    const event = async () => {
        const innerHtml = (await (await fetch(`/${tab.id}.ejs`)).json()).innerHtml;
        sessionPage.innerHTML = innerHtml;

        for (const t of tabs) {
            t.className = 'session-navbar-element';
        }

        tab.className = 'session-navbar-element session-navbar-selected';
    }

    tab.addEventListener('click', event);

    if (tab.id == defaultTab) {
        event();
    }
}