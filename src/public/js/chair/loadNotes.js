const storedNotes = getNotes(id);

for (const note of storedNotes) {
    const n = instantiate('note', notes, {
        delete: { id: `note-${noteNumber}` },
    }, {
        title: { innerHTML: note.title },
        text: { innerHTML: note.text },
    });

    const deleteButton = document.getElementById(`note-${noteNumber}`);
    deleteButton.addEventListener('click', () => {
        deleteNote({ id, title: note.title, text: note.text });
        n.remove();
    });

    noteNumber++;
}