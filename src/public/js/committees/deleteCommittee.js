const deleteButtons = document.querySelectorAll('.committee-delete');
const deleteAll = document.getElementById('delete-all');

for (const button of deleteButtons) {
    button.addEventListener('click', () => {
        const warning = new Popup();

        warning.addSmallHeader('Warning!');
        warning.addText(`Are you sure you want to delete '${button.name}'? This is a dangerous operation that CANNOT be undone`);
        
        warning.addButton('Confirm', 'red', async () => {
            const response = await fetch(`/deleteCommittee/${button.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                window.location = window.location;
            } else {
                warning.remove();
            }
        });

        warning.addButton('Cancel', 'blue', () => {
            warning.remove();
        });

        warning.show();
    });
}

deleteAll.addEventListener('click', () => {
    const warning = new Popup();

    warning.addSmallHeader('Warning!');
    warning.addText(`Are you sure you want to delete ALL committees? This is an EXTREMELY dangerous operation that CANNOT be undone`);
            
    warning.addButton('Confirm', 'red', async () => {
        const response = await fetch(`/deleteAllCommittees`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            window.location = window.location;
        } else {
            warning.remove();
        }
    });

    warning.addButton('Cancel', 'blue', () => {
        warning.remove();
    });

    warning.show();
});