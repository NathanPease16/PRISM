document.addEventListener('keydown', (e) => {
    const popup = new Popup();
    popup.addSmallHeader('New Note');
    popup.addText('Note Title');
    popup.addInput('Title');

    const textArea = document.createElement('textarea');
    textArea.className = 'large-input';

    popup.addText('Note');
    popup.addElement(textArea);

    popup.show();
});