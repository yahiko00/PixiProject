export class FpsMeter {
    private nbFrames: number;
    private elapsedTime: number;
    private previousTime: number;

    constructor(public render: () => void, private refreshDelay = 500) {
        this.nbFrames = 0;
        this.elapsedTime = 0;
        this.previousTime = performance.now();
    }

    updateTime() {
        this.elapsedTime = performance.now() - this.previousTime;
    }

    tick() {
        this.nbFrames++;
        if (this.elapsedTime > this.refreshDelay) {
            this.render();
            this.reset();
        }
    }

    reset() {
        this.nbFrames = 0;
        this.elapsedTime = 0;
        this.previousTime = performance.now();
    }

    getFrameRate() {
        return 1000.0 * this.nbFrames / this.elapsedTime;
    }
}
