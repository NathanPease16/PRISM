/**
 * Creates a class that allows for notifications to be easily
 * displayed to the user, with the ability to customize both
 * color and the text displayed
 * 
 * @summary Allows for notifications to be displayed to the user
 * 
 * @author Nathan Pease
 */

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

        // Append the notification to its container
        container.appendChild(notification);

        this.notification = container;
    }

    /**
     * Displays the notification on the web page
     */
    show() {
        document.body.insertBefore(this.notification, document.body.firstChild);

        // Remove the notification after 5 seconds
        setTimeout(() => {
            this.notification.remove();
        }, 5000);
    }

    /**
     * Removes the notification from the documment
     */
    hide() {
        this.notification.remove();
    }
}