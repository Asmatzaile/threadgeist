import { RangeParam } from "./RangeParam";

export class Threader {
    worker = new Worker(new URL("./threader.worker.js", import.meta.url), {type: 'module'});
    onstep = () => {}
    onfinish = () => {}
    settings = {
        distanceLimit: new RangeParam(0.001, 1, 0.07),
        distanceWeight: new RangeParam(0.1, 10, 0.6),
        directnessWeight: new RangeParam(0.1, 10, 3),
    }

    constructor() {
        this.worker.addEventListener("message", ({data}) => {
            const { route, finished } = data;
            this.route = route;
            this.onstep();
            if (finished) this.onfinish();
        })
    }

    createRoute(points, imgDiagonal) {
        const { distanceWeight, directnessWeight, distanceLimit } = this.settings;
        const maxDistance = imgDiagonal * distanceLimit;
        this.worker.postMessage({points, settings: { distanceWeight, directnessWeight, maxDistance }});
    }
}
