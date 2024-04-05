const sessionPage = document.getElementById('session-page');
const sessionNavbar = document.getElementById('session-navbar');

const tabs = sessionNavbar.querySelectorAll('.btn');

const defaultTab = 'gsl';

let previousScripts;

for (const tab of tabs) {
    const event = async () => {
        const innerHtml = (await (await fetch(`/${tab.id}.ejs`)).json()).innerHtml;
        sessionPage.innerHTML = innerHtml;

        for (const t of tabs) {
            t.className = 'session-navbar-element';
        }

        tab.className = 'session-navbar-element session-navbar-selected';

        const scripts = sessionPage.querySelectorAll('script');

        scripts.forEach((oldScript) => {
            const newScript = document.createElement('script');

            newScript.src = oldScript.src;

            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        previousScripts = scripts;
    }

    tab.addEventListener('click', event);

    if (tab.id == defaultTab) {
        event();
    }
}