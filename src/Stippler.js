import { RangeParam } from "./RangeParam";

export class Stippler {
    worker = new Worker(new URL("./stippler.worker.js", import.meta.url), {type: 'module'});
    onstep = () => {}
    onfinish = () => {}
    status = 'unstarted';

    settings = {
        pointCount: new RangeParam(100, 20000, 10000, 1),
    }

    constructor(imageLoader) {
        this.imageLoader = imageLoader;

        this.worker.addEventListener("message", ({data}) => {
            const { points, finished } = data;
            this.points = points;
            this.onstep();
            if (finished) {
                this.status = 'done';
                this.onfinish();
            }
        })
    }

    get image() {
        return this.imageLoader.image;
    }

    createStipple(onfinish) {
        this.points = this.samplePoints();
        this.relax(onfinish);
    }

    // Rejection sampling
    samplePoints(pointCount=this.settings.pointCount, image=this.image) {
        this.status = 'working';
        const points = new Float64Array(pointCount * 2);
        for (let i = 0; i < pointCount; ++i) {
            for (let j = 0; j < 30; ++j) {
                const x = points[i * 2] = Math.floor(Math.random() * image.width);
                const y = points[i * 2 + 1] = Math.floor(Math.random() * image.height);
                if (Math.random() < 1 - image.data[y * image.width + x]) break;
            }
        }
    
        this.points = points;
        this.status = 'done'
        return points;
    }

    relax(onfinish, steps=80) {
        this.onfinish = onfinish;
        this.status = 'working'
        this.worker.postMessage({name: "relax", args: {points: this.points, image: this.image, steps}});
    }

    stop() {
        this.worker.postMessage({name: "stop"});
    }
}
