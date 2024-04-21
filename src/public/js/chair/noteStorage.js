function getNotes(id) {
    let currentStorage = localStorage.getItem('notes');

    if (currentStorage) {
        currentStorage = JSON.parse(currentStorage);
    } else {
        currentStorage = {};
    }

    if (!id) {
        return currentStorage;
    } else {
        return currentStorage[id];
    }
}

function storeNote(note) {
    const currentStorage = getNotes();

    if (currentStorage[note.id]) {
        currentStorage[note.id].push({ title: note.title, text: note.text });
    } else {
        currentStorage[note.id] = [{ title: note.title, text: note.text }];
    }

    localStorage.setItem('notes', JSON.stringify(currentStorage));
}