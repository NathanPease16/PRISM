// const socket = io();

class Timer {
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

    static formatTime(time, minuteLength, secondLength) {
        // Divide by 60, convert to integer to get minutes and pad start
        const roundedTime = Math.ceil(time);

        const minutes = Math.floor(roundedTime / 60).toString().padStart(minuteLength, '0');
        // Get remainder after dividing by 60 to get seconds, pad start
        const seconds = Math.floor(roundedTime % 60).toString().padStart(secondLength, '0');

        return `${minutes}:${seconds}`;
    }

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

    play() {
        this.active = true;
        this.lastTime = Date.now();

        if (this.useImages) {
            this.pauseImg.style.display = '';
            this.playImg.style.display = 'none';
        }

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

    formatText() {
        this.text.textContent = `${Timer.formatTime(this.currentTime, 2, 2)} / ${Timer.formatTime(this.time, 2, 2)}`;
    }

    pause() {
        if (this.useImages) {
            this.playImg.style.display = '';
            this.pauseImg.style.display = 'none';
        }
        this.active = false;
    }

    reset() {
        this.pause();
        
        this.currentTime = this.time;
        this.text.textContent = `${Timer.formatTime(this.currentTime, 2, 2)} / ${Timer.formatTime(this.time, 2, 2)}`;
    }

    setTime(time) {
        this.time = time;

        this.reset();
    }

    setCurrentTime(time) {
        this.currentTime = time;
    }
}