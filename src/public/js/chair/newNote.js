const notes = document.getElementById('notes');
let popupActive = false;

const id = window.location.href.split('/')[4];
let noteNumber = 0;

document.addEventListener('keydown', (e) => {
    if (popupActive) {
        return;
    }
    popupActive = true;

    const popup = new Popup();
    popup.addSmallHeader('New Note');
    popup.addText('Note Title');
    const titleInput = popup.addInput('Title');

    const textArea = document.createElement('textarea');
    textArea.className = 'large-input';

    popup.addText('Note');
    popup.addElement(textArea);

    popup.addButton('Submit', 'blue', () => {
        const note = instantiate('note', notes, {
            delete: { id: `note-${noteNumber}`},
        }, {
            title: { innerHTML: titleInput.value },
            text: { innerHTML: textArea.value },
        });

        const deleteButton = document.getElementById(`note-${noteNumber}`);
        deleteButton.addEventListener('click', () => {
            deleteNote({ id, title: titleInput.value, text: textArea.value });
            note.remove();
        });

        noteNumber++;

        storeNote({ title: titleInput.value, text: textArea.value, id });

        popup.remove();
    });

    popup.addButton('Cancel', 'red', () => {
        console.log('Cancel');
        popup.remove();
    });

    popup.show();

    popup.addCloseEvent(() => {
        popupActive = false;
    });
});