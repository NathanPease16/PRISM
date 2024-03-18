const committeeSearch = document.getElementById('search');
const committeeContainer = document.getElementById('committee-container');
const deleteAll = document.getElementById('delete-all');

function displayDeleteConfirmation(name, id) {
    // Create translucent black bg
    const confirmBg = document.createElement('div');
    confirmBg.className = 'confirm-bg';

    // Create white window in middle that will hold
    // confirmation elements
    const confirmWindow = document.createElement('div');
    confirmWindow.className = 'confirm-window';

    // Create text displaying confirmation message
    const confirmText = document.createElement('p');
    confirmText.className = 'confirm-text';
    if (id != 'all') {
        confirmText.textContent = `Are you sure you wish to delete the committee '${name}'?`
    } else {
        confirmText.textContent = 'Are you sure you wish to delete ALL committees? This is a dangerous operation';
    }

    // Div to hold action confirmation buttons
    const confirmButtonsDiv = document.createElement('div');
    confirmButtonsDiv.className = 'confirm-buttons';

    // Button for confirming action
    const confirmButton = document.createElement('button');
    confirmButton.classList = 'confirm-button confirm';
    confirmButton.textContent = 'Confirm';

    // Button for canceling action
    const cancelButton = document.createElement('button');
    cancelButton.classList = 'confirm-button cancel';
    cancelButton.textContent = 'Cancel';

    // Delete the committee if they confirm the action
    confirmButton.addEventListener('click', async () => {
        let post = `/deleteCommittee/${id}`;
        if (id == 'all') {
            post = '/deleteAllCommittees';
        }

        const response = await fetch(post, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Reload page, remove confirmation window
        if (response.ok) {
            window.location = window.location;
        } else {
            confirmBg.remove();
        }
    });

    // Remove confirmation window
    cancelButton.addEventListener('click', () => {
        confirmBg.remove();
    })

    // Add elements to the body
    confirmButtonsDiv.appendChild(confirmButton);
    confirmButtonsDiv.appendChild(cancelButton);

    confirmWindow.appendChild(confirmText);
    confirmWindow.appendChild(confirmButtonsDiv);

    confirmBg.appendChild(confirmWindow);

    document.body.prepend(confirmBg);
}

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
        moderateButton.href = `/moderate/${committee.id}`;
        moderateButton.textContent = 'Moderate';

        // Button for editing
        const editButton = document.createElement('a');
        editButton.className = 'committee-button edit';
        editButton.href = `/edit/${committee.id}`;
        editButton.textContent = 'Edit';

        // Button for deleting
        const deleteButton = document.createElement('button');
        deleteButton.className = 'committee-button delete';
        deleteButton.textContent = 'Delete';

        // Display confirmation window upon clicking delete button
        deleteButton.addEventListener('click', async () => {
            displayDeleteConfirmation(committee.name, committee.id);
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
    displayDeleteConfirmation('all', 'all');
});

// Re-render committees when search bar is updated
committeeSearch.addEventListener('input', async () => {
    await renderCommittees(committeeSearch.value.trimStart().toLowerCase());
});