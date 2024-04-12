/**
 * Notifications that drop down from the top of the screen
 */
class Notification {
    /**
     * Constructs a new notification object
     * @param {*} text The text to appear on the notification
     * @param {*} color What color the notification should be (From a preset list red, green, blue, orange)
     */
    constructor(text, color) {
        this.text = text;
        this.color = color;

        // Create a new container to hold the notification
        const container = document.createElement('div');
        container.className = 'notification-container';

        // Create the notification and assign its text and color
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