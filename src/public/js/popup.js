/**
 * Creates a class that allows for a popup to be easily displayed
 * to the user. Headers, small headers, text, buttons, input boxes,
 * and misc elements can all be easily added to the popup
 * 
 * @summary Allows for a popup to be displayed to the user
 * 
 * @author Nathan Pease
 */

const none = 'display: none;';

/**
 * Displays a popup where information can be entered, notices can be given, etc.
 */
class Popup {
    toggled;
    width;

    constructor(w) {
        this.width = w;

        // Create all the HTML for the popup
        this.popup = document.createElement('div');
        this.popup.id = 'popup';
        this.popup.style = none + `width: ${this.width};`;

        this.blackout = document.createElement('div');
        this.blackout.className = 'popup-blackout';

        this.container = document.createElement('div');
        this.container.className = 'popup-container';

        this.menu = document.createElement('div');
        this.menu.className = 'popup-menu';

        this.menu.style = `min-width: ${this.width}`;

        this.container.appendChild(this.menu);
        
        this.popup.appendChild(this.blackout);
        this.popup.appendChild(this.container);

        document.body.appendChild(this.popup);

        // If the area outside the popup is clicked, remove it
        this.blackout.addEventListener('click', () => {
            this.remove();
        });
    }

    /**
     * Shows the popup
     */
    show() {
        this.popup.style = '';
        this.toggled = true;
    }

    /**
     * Hides the popup
     */
    hide() {
        this.popup.style = none;
        this.toggled = false;
    }

    /**
     * Toggles the popup on or off depending on its current state
     */
    toggle() {
        if (this.toggled) {
            this.popup.style = none;
        } else {
            this.popup.style = '';
        }

        this.toggled = !this.toggled;
    }

    /**
     * Adds large text to the popup
     * @param {*} text Text for the header
     * @returns The header object
     */
    addHeader(text) {
        const header = document.createElement('p');
        header.textContent = text;
        header.className = 'popup-header';

        this.menu.appendChild(header);

        return header;
    }

    /**
     * Adds a small header to the popup
     * @param {*} text Text of the small header
     * @returns The small header object
     */
    addSmallHeader(text) {
        const smallHeader = document.createElement('p');
        smallHeader.textContent = text;
        smallHeader.className = 'popup-small-header';

        this.menu.appendChild(smallHeader);

        return smallHeader;
    }

    /**
     * Adds text to the popup
     * @param {*} text The text for the text object
     * @returns The text object
     */
    addText(text) {
        const p = document.createElement('p');
        p.textContent = text;
        p.className = 'popup-text';

        this.menu.appendChild(p);

        return p;
    }

    /**
     * Adds a button to the popup
     * @param {*} text The text for the button
     * @param {*} color What color the button should be
     * @param {*} event 'click' event for the button
     * @returns The button object
     */
    addButton(text, color, event) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `popup-button popup-text popup-${color}`;

        this.menu.appendChild(button);

        if (event && typeof event == typeof (() => {})) {
            button.addEventListener('click', event);
        }

        return button;
    }

    /**
     * Adds an input field to the popup
     * @param {*} placeholder Placeholder text
     * @param {*} id The input field's ID
     * @param {*} name name for the input field
     * @returns The input field object
     */
    addInput(placeholder, id, name) {
        const input = document.createElement('input');
        input.placeholder = placeholder;
        input.className = 'popup-input popup-text';
        input.id = id;
        input.name = name;

        this.menu.appendChild(input);

        return input;
    }

    /**
     * Adds a given element to the popup
     * @param {*} element The element to add
     */
    addElement(element) {
        this.menu.appendChild(element);
    }

    /**
     * Removes the popup entirely from the document
     */
    remove() {
        document.body.removeChild(this.popup);
    }
}
