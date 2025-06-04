import { RangeParam } from "./RangeParam";

export class Threader {
    worker = new Worker(new URL("./threader.worker.js", import.meta.url), {type: 'module'});
    onstep = () => {}
    onfinish = () => {}
    status = 'unstarted'
    route = [];

    settings = {
        distanceLimit: new RangeParam(0.001, 1, 0.07),
        distanceWeight: new RangeParam(0.1, 10, 0.6),
        directnessWeight: new RangeParam(0.1, 10, 3),
    }

    constructor(stippler) {
        this.stippler = stippler;
        this.worker.addEventListener("message", ({data}) => {
            const { route, finished } = data;
            if (route) {
                this.route = route;
                this.onstep();
            }
            if (finished) {
                this.status = 'done';
                this.onfinish();
            }
        })
    }

    stop() {
        this.worker.postMessage({name: "stop"});
    }

    createRoute(onfinish, points=this.stippler.points) {
        const route = this.route = [];
        this.status = 'working';
        this.onfinish = onfinish;
        const { distanceWeight, directnessWeight, distanceLimit } = this.settings;
        const imgDiagonal = Math.sqrt(Math.pow(this.stippler.image.width, 2) + Math.pow(this.stippler.image.height, 2));
        const maxDistance = imgDiagonal * distanceLimit;
        this.worker.postMessage({name: "calculateRoute", args: {points, route, settings: { distanceWeight: distanceWeight.value, directnessWeight: directnessWeight.value, maxDistance }}});
    }

    get result() {
        return { points: this.stippler.points, route: this.route }
    }
}
