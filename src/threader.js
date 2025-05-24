export class Threader {
    worker = new Worker(new URL("./threader.worker.js", import.meta.url), {type: 'module'});
    onstep = () => {}
    onfinish = () => {}

    constructor() {
        this.worker.addEventListener("message", ({data}) => {
            const { route, finished } = data;
            this.route = route;
            this.onstep();
            if (finished) this.onfinish();
        })
    }

    createRoute(points, imgDiagonal) {
        this.worker.postMessage({points, imgDiagonal});
    }
}
