const sidePanel = document.getElementById('side-panel');
const cover = document.getElementById('side-panel-cover');

const openButton = document.getElementById('open-side-panel');
const closeButton = document.getElementById('close-side-panel');

openButton.addEventListener('click', () => {
    sidePanel.className = 'side-panel-open';
    cover.style = '';
});

closeButton.addEventListener('click', () => {
    sidePanel.className = 'side-panel-closed';
    cover.style = 'display: none;';
});