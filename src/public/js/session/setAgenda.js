const agendaText = document.getElementById('agenda');
const setAgenda = document.getElementById('set-agenda');

setAgenda.addEventListener('click', () => {
    const popup = new Popup();

    popup.addSmallHeader('Set Agenda');
    const agenda = popup.addInput('Agenda');

    popup.addButton('Set', 'blue', async () => {
        const response = await fetch(`/setAgenda/${committee.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ agenda: agenda.value }),
        });

        if (!response.ok) {
            const error = await response.json();
            const notification = new Notification(error, 'red');
            notification.show();
        }

        agendaText.textContent = `Agenda: ${agenda.value}`;

        popup.remove();
    });

    popup.addButton('Cancel', 'red', () => {
        popup.remove();
    });

    popup.show();
});