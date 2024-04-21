const storedNotes = getNotes(id);

for (const note of storedNotes) {
    instantiate('note', notes, {}, {
        title: { innerHTML: note.title },
        text: { innerHTML: note.text },
    });
}