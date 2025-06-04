import { RangeParam } from "./RangeParam";

export class Threader {
    worker = new Worker(new URL("./threader.worker.js", import.meta.url), {type: 'module'});
    onstep = () => {}
    onfinish = () => {}
    status = 'unstarted'
    route = [];

    settings = {
        distanceLimit: new RangeParam(0.001, 1, 0.07),
        closenessWeight: new RangeParam(-1, 1, 0.3, {step: 0.1, display: 'box'}),
        directnessWeight: new RangeParam(-1, 1, 0.2, {step: 0.1, display: 'box'}),
        randomness: new RangeParam(0, 1, 0.2, {scale: 'linear'})
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
        const { closenessWeight, directnessWeight, randomness, distanceLimit } = this.settings;
        const imgDiagonal = Math.sqrt(Math.pow(this.stippler.image.width, 2) + Math.pow(this.stippler.image.height, 2));
        const maxDistance = imgDiagonal * distanceLimit;
        this.worker.postMessage({name: "calculateRoute", args: {points, route, settings: { closenessWeight: closenessWeight.value, directnessWeight: directnessWeight.value, randomness: randomness.value, maxDistance }}});
    }

    get result() {
        return { points: this.stippler.points, route: this.route }
    }
}
