const none = 'display: none;';

class Popup {
    toggled;
    width;

    constructor(w) {
        this.width = w;

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

        this.blackout.addEventListener('click', () => {
            this.remove();
        });
    }

    show() {
        this.popup.style = '';
        this.toggled = true;
    }

    hide() {
        this.popup.style = none;
        this.toggled = false;
    }

    toggle() {
        if (this.toggled) {
            this.popup.style = none;
        } else {
            this.popup.style = '';
        }

        this.toggled = !this.toggled;
    }

    addHeader(text) {
        const header = document.createElement('p');
        header.textContent = text;
        header.className = 'popup-header';

        this.menu.appendChild(header);

        return header;
    }

    addSmallHeader(text) {
        const smallHeader = document.createElement('p');
        smallHeader.textContent = text;
        smallHeader.className = 'popup-small-header';

        this.menu.appendChild(smallHeader);

        return smallHeader;
    }

    addText(text) {
        const p = document.createElement('p');
        p.textContent = text;
        p.className = 'popup-text';

        this.menu.appendChild(p);

        return p;
    }

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

    addInput(placeholder, id, name) {
        const input = document.createElement('input');
        input.placeholder = placeholder;
        input.className = 'popup-input popup-text';
        input.id = id;
        input.name = name;

        this.menu.appendChild(input);

        return input;
    }

    addElement(element) {
        this.menu.appendChild(element);
    }

    remove() {
        document.body.removeChild(this.popup);
    }
}
