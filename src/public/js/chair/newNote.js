const notes = document.getElementById('notes');
let popupActive = false;

const id = window.location.href.split('/')[4];

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
        instantiate('note', notes, {}, {
            title: { innerHTML: titleInput.value },
            text: { innerHTML: textArea.value },
        });

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