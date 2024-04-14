/**
 * Creates a timer class, which allows for multiple different
 * timers to exist on the same page and lets you easily run
 * a timer that automatically updates a text box and play
 * button
 * 
 * @summary Creates a timer class
 * 
 * @author Nathan Pease
 */

/**
 * Easily handles timing and timers
 */
class Timer {
    /**
     * Constructs a new timer object
     * @param {*} startTime Time to start at
     * @param {*} text Text object to modify
     * @param {*} playImg Image for a play button (play)
     * @param {*} pauseImg Image for a play button (pause)
     * @param {*} useImages Whether or not to make modifications to images
     */
    constructor(startTime, text, playImg, pauseImg, useImages=true) {
        this.time = startTime;
        this.currentTime = startTime;
        this.lastTime = Date.now();
        this.text = text;
        this.playImg = playImg;
        this.pauseImg = pauseImg;
        this.useImages = useImages;
        
        this.active = false;
    }

    /**
     * Formats the time aa:bb
     * @param {*} time The length of time
     * @param {*} minuteLength How many digits in the minutes (1 = 1:, 2 = 01:, etc.)
     * @param {*} secondLength How many digits in the seconds 
     * @returns The formatted length of time
     */
    static formatTime(time, minuteLength, secondLength) {
        // Divide by 60, convert to integer to get minutes and pad start
        const roundedTime = Math.ceil(time);

        const minutes = Math.floor(roundedTime / 60).toString().padStart(minuteLength, '0');
        // Get remainder after dividing by 60 to get seconds, pad start
        const seconds = Math.floor(roundedTime % 60).toString().padStart(secondLength, '0');

        return `${minutes}:${seconds}`;
    }

    /**
     * Updates the timer to reflect Dt, and stops it if 
     * the time is at or below zero
     */
    updateTimer() {
        const now = Date.now();
        const deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;

        this.currentTime -= deltaTime;

        if (this.currentTime <= 0) {
            this.active = false;
            this.currentTime = 0;
        }
    }

    /**
     * Plays the timer by continuously updating it
     */
    play() {
        this.active = true;
        this.lastTime = Date.now();

        if (this.useImages) {
            this.pauseImg.style.display = '';
            this.playImg.style.display = 'none';
        }

        // Constantly update the timer and check if its active
        const run = () => {
            if (this.active) {
                this.updateTimer();
                
                this.text.textContent = `${Timer.formatTime(this.currentTime, 2, 2)} / ${Timer.formatTime(this.time, 2, 2)}`;
    
                if (this.currentTime > 0) {
                    requestAnimationFrame(run);
                } else {
                    this.pause();
                }
            }
        }

        run();
    }

    /**
     * Format the text
     */
    formatText() {
        this.text.textContent = `${Timer.formatTime(this.currentTime, 2, 2)} / ${Timer.formatTime(this.time, 2, 2)}`;
    }

    /**
     * Pauses the timer
     */
    pause() {
        if (this.useImages) {
            this.playImg.style.display = '';
            this.pauseImg.style.display = 'none';
        }
        this.active = false;
    }

    /**
     * Resets the timer to its time value
     */
    reset() {
        this.pause();
        
        this.currentTime = this.time;
        this.text.textContent = `${Timer.formatTime(this.currentTime, 2, 2)} / ${Timer.formatTime(this.time, 2, 2)}`;
    }

    /**
     * Sets the time value on the timer and resets it
     * @param {*} time Amount of time to set the timer to 
     */
    setTime(time) {
        this.time = time;

        this.reset();
    }

    /**
     * Sets the current time value
     * @param {*} time Amount of time to set the current time to 
     */
    setCurrentTime(time) {
        this.currentTime = time;
    }
}