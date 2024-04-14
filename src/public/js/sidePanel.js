/**
 * Handles the opening and closing of the side panel
 * 
 * @summary Handles the opening and closing of the side panel
 * 
 * @author Nathan Pease
 */

const sidePanel = document.getElementById('side-panel');
const cover = document.getElementById('side-panel-cover');

const openButton = document.getElementById('open-side-panel');
const closeButton = document.getElementById('close-side-panel');

// Opens the side panel
openButton.addEventListener('click', () => {
    sidePanel.className = 'side-panel-open';
    cover.style = '';
});

// Closes the side panel
closeButton.addEventListener('click', () => {
    sidePanel.className = 'side-panel-closed';
    cover.style = 'display: none;';
});

// Closes the side panel when clicked outside
cover.addEventListener('click', () => {
    sidePanel.className = 'side-panel-closed';
    cover.style = 'display: none;';
});