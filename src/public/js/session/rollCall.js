const rollCall = document.getElementById('roll-call');

rollCall.addEventListener('click', () => {
    const popup = new Popup('30vw');

    popup.addSmallHeader('Roll Call');

    popup.addButton('All Present', 'orange', () => {
        for (const country of committee.countries) {
            country.attendance = 'P';

            document.getElementById(`${country.title}-PV`).className = 'rollCall-button rollCall-blue';
            document.getElementById(`${country.title}-P`).className = 'rollCall-button rollCall-orange-selected';
            document.getElementById(`${country.title}-A`).className = 'rollCall-button rollCall-red';
        }
    });

    popup.addButton('All Absent', 'red', () => {
        for (const country of committee.countries) {
            country.attendance = 'A';

            document.getElementById(`${country.title}-PV`).className = 'rollCall-button rollCall-blue';
            document.getElementById(`${country.title}-P`).className = 'rollCall-button rollCall-orange';
            document.getElementById(`${country.title}-A`).className = 'rollCall-button rollCall-red-selected';
        }
    });

    const container = document.createElement('div');
    container.className = 'rollCall-container';

    for (const country of committee.countries) {
        if (!country.attendance) {
            country.attendance = 'A';
        }

        let pv = 'rollCall-blue';
        let p = 'rollCall-orange';
        let a = 'rollCall-red';

        if (country.attendance && country.attendance === 'PV') {
            pv = 'rollCall-blue-selected';
        } else if (country.attendance && country.attendance === 'P') {
            p = 'rollCall-orange-selected';
        } else {
            a = 'rollCall-red-selected';
        }

        const div = instantiate('country', container, {
            country: { class: 'rollCall-country', },
            flag: { src: `/global/flags/${country.flagCode.toLowerCase()}.png`, }
        }, {
            name: { textContent: country.title, },
        });

        const buttons = document.createElement('div');
        buttons.className = 'rollCall-buttons';

        const presentVoting = document.createElement('button');
        presentVoting.className = `rollCall-button ${pv}`;
        presentVoting.textContent = 'PV';
        presentVoting.id = `${country.title}-PV`;

        const present = document.createElement('button');
        present.className = `rollCall-button ${p}`;
        present.textContent = 'P';
        present.id = `${country.title}-P`;

        const absent = document.createElement('button');
        absent.className = `rollCall-button ${a}`;
        absent.textContent = 'A';
        absent.id = `${country.title}-A`;

        presentVoting.addEventListener('click', () => {
            presentVoting.className = 'rollCall-button rollCall-blue-selected';
            present.className = 'rollCall-button rollCall-orange';
            absent.className = 'rollCall-button rollCall-red';
            country.attendance = 'PV';
        });

        present.addEventListener('click', () => {
            presentVoting.className = 'rollCall-button rollCall-blue';
            present.className = 'rollCall-button rollCall-orange-selected';
            absent.className = 'rollCall-button rollCall-red';
            country.attendance = 'P';
        });

        absent.addEventListener('click', () => {
            presentVoting.className = 'rollCall-button rollCall-blue';
            present.className = 'rollCall-button rollCall-orange';
            absent.className = 'rollCall-button rollCall-red-selected';
            country.attendance = 'A';
        });

        buttons.appendChild(presentVoting);
        buttons.appendChild(present);
        buttons.appendChild(absent);

        div.appendChild(buttons);
    }

    popup.addElement(container);

    popup.addButton('Finish', 'blue', async () => {
        const response = await fetch(`/rollCall/${committee.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(committee),
        });

        if (response.ok) {
            window.location = window.location;
        } else {
            const error = await response.json();
            const notification = new Notification(error, 'red');
            notification.show();
        }

        popup.remove();
    });

    popup.addButton('Cancel', 'red', () => {
        popup.remove();
    });

    popup.show();
});