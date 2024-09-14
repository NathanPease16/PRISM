// might be the worst code i've ever written, please ignore
// i literally hate css so much picking up this project after months
// and coming back and jumping straight into css was not a good idea
function expand(note) {
    const title = note.querySelector('.chair-note-title') || note.querySelector('.chair-note-title-expanded');
    const text = note.querySelector('.chair-note-text') || note.querySelector('.chair-note-text-expanded');
    const container = note.querySelector('.chair-note-text-container') || note.querySelector('.chair-note-text-container-expanded');

    if (note.classList == 'chair-note-expanded') 
    {
        note.classList = 'chair-note';
        title.classList = 'chair-note-title';
        text.classList = 'chair-note-text';
        container.classList = 'chair-note-text-container';
    }
    else
    {
        note.classList = 'chair-note-expanded';
        title.classList = 'chair-note-title-expanded';
        text.classList = 'chair-note-text-expanded';
        container.classList = 'chair-note-text-container-expanded';
    }
}