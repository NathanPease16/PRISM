/**
 * Sets the agenda by making a request to the server,
 * and notifying listening clients through the use
 * of sockets that the agenda was updated
 * 
 * @summary Sets the agenda
 * 
 * @author Nathan Pease
 */

const agendaText = document.getElementById('agenda');
const setAgenda = document.getElementById('set-agenda');

// Displays a menu to set the agenda
setAgenda.addEventListener('click', () => {
    const popup = new Popup();

    popup.addSmallHeader('Set Agenda');
    const agenda = popup.addInput('Agenda');

    // Sends a request to the server to set the agenda
    popup.addButton('Set', 'blue', async () => {
        const response = await fetch(`/setAgenda/${committee.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ agenda: agenda.value }),
        });

        // If failed show an error
        if (!response.ok) {
            const error = await response.json();
            const notification = new Notification(error, 'red');
            notification.show();
        // Otherwise, send out a session update
        } else {
            sessionUpdate({ updateType: 'agenda', agenda: agenda.value });
        }

        // Set the agenda text
        agendaText.textContent = `Agenda: ${agenda.value}`;

        popup.remove();
    });

    popup.addButton('Cancel', 'red', () => {
        popup.remove();
    });

    popup.show();
});