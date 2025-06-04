export class Timer {
    constructor(duration) {
        this.duration = duration;
    }
    
    start() {
        this.startTime = performance.now();
    }

    get isOver() {
        return this.elapsedTime > this.duration;
    }

    get elapsedTime() {
        return performance.now() - this.startTime;
    }

}
