const committeeSearch = document.getElementById('search');
const committeeContainer = document.getElementById('committee-container');

function displayDeleteConfirmation(name, id) {
    const confirmBg = document.createElement('div');
    confirmBg.className = 'confirm-bg';

    const confirmWindow = document.createElement('div');
    confirmWindow.className = 'confirm-window';

    const confirmText = document.createElement('p');
    confirmText.className = 'confirm-text';
    confirmText.textContent = `Are you sure you wish to delete the committee '${name}'?`

    const confirmButtonsDiv = document.createElement('div');
    confirmButtonsDiv.className = 'confirm-buttons';

    const confirmButton = document.createElement('button');
    confirmButton.classList = 'confirm-button confirm';
    confirmButton.textContent = 'Confirm';

    const cancelButton = document.createElement('button');
    cancelButton.classList = 'confirm-button cancel';
    cancelButton.textContent = 'Cancel';

    confirmButton.addEventListener('click', async () => {
        const response = await fetch(`/delete/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            window.location = window.location;
        } else {
            confirmBg.remove();
        }
    });

    cancelButton.addEventListener('click', () => {
        confirmBg.remove();
    })

    confirmButtonsDiv.appendChild(confirmButton);
    confirmButtonsDiv.appendChild(cancelButton);

    confirmWindow.appendChild(confirmText);
    confirmWindow.appendChild(confirmButtonsDiv);

    confirmBg.appendChild(confirmWindow);

    document.body.prepend(confirmBg);
}

async function renderCommittees(filter) {
    committeeContainer.innerHTML = '';

    const committeesJson = await committees;

    for (const committee of committeesJson.committees) {
        if (!committee.name.toLowerCase().startsWith(filter)) {
            continue;
        }

        const committeeDiv = document.createElement('div');
        committeeDiv.className = 'committee';

        const name = document.createElement('p');
        name.className = 'committee-text';
        name.textContent = committee.name;

        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'committee-buttons';

        const moderateButton = document.createElement('a');
        moderateButton.className = 'committee-button edit';
        moderateButton.href = `/moderate/${committee.id}`;
        moderateButton.textContent = 'Moderate';

        const editButton = document.createElement('a');
        editButton.className = 'committee-button edit';
        editButton.href = `/edit/${committee.id}`;
        editButton.textContent = 'Edit';

        const deleteButton = document.createElement('button');
        deleteButton.className = 'committee-button delete';
        deleteButton.textContent = 'Delete';

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
 (async () => {
    await renderCommittees('');
 })();

committeeSearch.addEventListener('input', async () => {
    await renderCommittees(committeeSearch.value.trimStart().toLowerCase());
});