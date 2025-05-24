export class Stippler {
    worker = new Worker(new URL("./stippler.worker.js", import.meta.url), {type: 'module'});
    onstep = () => {}
    onfinish = () => {}

    constructor(image, pointCount) {
        this.loadImage(image);
        this.points = this.samplePoints(pointCount);

        this.worker.addEventListener("message", ({data}) => {
            const { points, finished } = data;
            this.points = points;
            this.onstep();
            if (finished) this.onfinish();
        })
    }

    loadImage(image) {
        this.image = image;
    }

    // Rejection sampling
    samplePoints(pointCount, image=this.image) {
        const points = new Float64Array(pointCount * 2);
        for (let i = 0; i < pointCount; ++i) {
            for (let j = 0; j < 30; ++j) {
                const x = points[i * 2] = Math.floor(Math.random() * image.width);
                const y = points[i * 2 + 1] = Math.floor(Math.random() * image.height);
                if (Math.random() < image.data[y * image.width + x]) break;
            }
        }
    
        return points;
    }

    spacePoints(steps=80) {   
        this.worker.postMessage({points: this.points, image: this.image, steps});
    }
}
