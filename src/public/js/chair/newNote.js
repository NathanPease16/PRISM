const notes = document.getElementById('notes');
const addNote = document.getElementById('add-note');

const id = window.location.href.split('/')[4];
let noteNumber = 0;

addNote.addEventListener('click', () => {
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

        note.addEventListener('click', () => { expand(note); });
    });

    popup.addButton('Cancel', 'red', () => {
        console.log('Cancel');
        popup.remove();
    });

    popup.show();
});