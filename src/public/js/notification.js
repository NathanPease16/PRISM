class Notification {
    constructor(text, color) {
        this.text = text;
        this.color = color;

        const container = document.createElement('div');
        container.className = 'notification-container';

        const notification = document.createElement('div');
        notification.className = `notification notification-${this.color}`;
        notification.textContent = this.text;

        container.appendChild(notification);

        this.notification = container;
    }

    show() {
        document.body.insertBefore(this.notification, document.body.firstChild);

        setTimeout(() => {
            this.notification.remove();
        }, 5000);
    }

    hide() {
        this.notification.remove();
    }
}