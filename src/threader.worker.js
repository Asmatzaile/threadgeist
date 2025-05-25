import { sleep } from "./utils";

self.onmessage = event => {
    const {data: { name, args }} = event;
    if (methods[name]) return methods[name](args);
    console.error(`Unknown method: ${name}`);
}

const freePoints = new Map();

let shouldStop;
// points is a 1d array with [x0, y0, x1, y1, ...]
async function calculateRoute({points, route, settings}) {
    shouldStop = false;
    route = [];

    freePoints.clear();
    const pointCount = points.length / 2;
    for (let i = 0; i < pointCount; i++) {
        freePoints.set(i, [points[i*2], points[i*2+1]]);
    }
    
    let currentIndex = Math.floor(Math.random() * pointCount);
    let angle = Math.random() * Math.PI * 2;
    for (let i = 0; i < pointCount; i++) {
        route.push(currentIndex);
        self.postMessage({route})
        const [currentX, currentY] = freePoints.get(currentIndex);
        freePoints.delete(currentIndex);

        currentIndex = getNextIndex(currentX, currentY, angle, settings);
        if (currentIndex === undefined) break;
        angle = freePoints.get(currentIndex);
        
        await sleep(0); // make it able to get shouldStop
        if (shouldStop) break;
    }
    self.postMessage({finished: true, route});
}

function stop() {
    shouldStop = true;
}

const methods = {
    calculateRoute, stop
}

function getNextIndex(currentX, currentY, orientation, settings) {
    const { maxDistance, distanceWeight, directnessWeight } = settings;
    let bestScore = 0;
    let nextIndex;
    freePoints.entries().forEach(([index, [x, y]]) => {
        const distance = Math.sqrt(Math.pow(x-currentX, 2) + Math.pow(y-currentY, 2));
        if (distance > maxDistance) return;
        const angle = Math.atan2(y-currentY, x-currentX);
        const directness = Math.cos(angle-orientation) / 2 + 0.5;
        const score = Math.pow(1 / (distance + 0.000001), distanceWeight) * Math.pow(directness, directnessWeight);
        if (score <= bestScore) return;
        nextIndex = index;
        bestScore = score;
    });
    return nextIndex;
}
