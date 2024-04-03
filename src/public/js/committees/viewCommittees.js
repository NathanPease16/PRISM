const committeeSearch = document.getElementById('search');
const committeeContainer = document.getElementById('committee-container');
const deleteAll = document.getElementById('delete-all');

async function renderCommittees(filter) {
    // Reset the container to avoid appending instead of
    // overwriting
    committeeContainer.innerHTML = '';

    // Get committees from internal.js
    const committeesJson = await committees;

    for (const committee of committeesJson.data) {
        // If committee's name doesn't match with the filter,
        // don't show it
        if (!committee.name.toLowerCase().startsWith(filter)) {
            continue;
        }

        // Create div for the committee
        const committeeDiv = document.createElement('div');
        committeeDiv.className = 'committee';

        // Create committee's name text
        const name = document.createElement('p');
        name.className = 'committee-text';
        name.textContent = committee.name;

        // Div for holding committee action buttons
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'committee-buttons';

        // Moderate button
        const moderateButton = document.createElement('a');
        moderateButton.className = 'committee-button edit';
        moderateButton.href = `/session/${committee.id}`;
        moderateButton.textContent = 'Session';

        // Button for editing
        const editButton = document.createElement('a');
        editButton.className = 'committee-button edit';
        editButton.href = `/edit/${committee.id}`;
        editButton.textContent = 'Edit';

        // Button for deleting
        const deleteButton = document.createElement('button');
        deleteButton.className = 'committee-button delete';
        deleteButton.textContent = 'Delete';

        deleteButton.addEventListener('click', () => {
            const warning = new Popup();

            warning.addSmallHeader('Warning!');
            warning.addText(`Are you sure you want to delete '${committee.name}'? This is a dangerous operation that CANNOT be undone`);
            
            warning.addButton('Confirm', 'red', async () => {
                const response = await fetch(`/deleteCommittee/${committee.id}`, {
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

        buttonsDiv.appendChild(moderateButton);
        buttonsDiv.appendChild(editButton);
        buttonsDiv.appendChild(deleteButton);

        committeeDiv.appendChild(name);
        committeeDiv.appendChild(buttonsDiv);

        committeeContainer.appendChild(committeeDiv);
    }
}

// Render committees on page load
(async () => {
    await renderCommittees('');
})();

 // Delete all items when deleteAll is pressed
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

// Re-render committees when search bar is updated
committeeSearch.addEventListener('input', async () => {
    await renderCommittees(committeeSearch.value.trimStart().toLowerCase());
});