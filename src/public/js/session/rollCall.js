const rollCall = document.getElementById('roll-call');

rollCall.addEventListener('click', () => {
    const popup = new Popup();

    popup.addSmallHeader('Roll Call');

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

        const div = document.createElement('div');
        div.className = 'rollCall-country';

        const picture = document.createElement('img');
        picture.src = `/global/flags/${country.flagCode.toLowerCase()}.png`;

        const text = document.createElement('p');
        text.textContent = country.title;

        const buttons = document.createElement('div');
        buttons.className = 'rollCall-buttons';

        const presentVoting = document.createElement('button');
        presentVoting.className = `rollCall-button ${pv}`;
        presentVoting.textContent = 'PV';

        const present = document.createElement('button');
        present.className = `rollCall-button ${p}`;
        present.textContent = 'P';

        const absent = document.createElement('button');
        absent.className = `rollCall-button ${a}`;
        absent.textContent = 'A';

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

        div.appendChild(picture);
        div.appendChild(text);
        div.appendChild(buttons);

        container.appendChild(div);
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
            //window.location = `/session/${committee.id}`;
            window.location = window.location;
        } else {
            console.log('Failed to conduct roll call');
        }

        popup.hide();
    });

    popup.addButton('Cancel', 'red', () => {
        popup.hide();
    });

    popup.show();
});