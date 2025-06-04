import { quadtree as makeQuadtree } from "d3-quadtree";
import { findInCircle } from "./thirdparty/findInCircle";
import { Timer } from "./Timer";
import { lerp, sleep } from "./utils";

self.onmessage = event => {
    const {data: { name, args }} = event;
    if (methods[name]) return methods[name](args);
    console.error(`Unknown method: ${name}`);
}

const visitedPoints = new Set();

let shouldStop;
// points is a 1d array with [x0, y0, x1, y1, ...]
async function calculateRoute({points, route, settings}) {
    shouldStop = false;
    route = [];
    const data = [];
    const pointCount = points.length / 2;
    for (let i = 0; i < pointCount; i ++) {
        data.push([points[i*2], points[i*2 + 1], i]);
    }
    const qt = makeQuadtree(data);
    visitedPoints.clear();

    let currentIndex = Math.floor(Math.random() * pointCount);
    let oldX, oldY;
    const timer = new Timer(200);
    timer.start();
    for (let i = 0; i < pointCount; i++) {
        route.push(currentIndex);
        visitedPoints.add(currentIndex); // actually it's the same as route :v todo remove
        self.postMessage({route});
    
        const x = points[currentIndex*2], y = points[currentIndex*2+1];
        const angle = i !== 0 ? Math.atan2(y-oldY, x-oldX) : Math.random() * Math.PI * 2;
        currentIndex = getNextIndex(qt, [x, y], angle, settings);

        if (currentIndex === undefined) break;
        oldX = x, oldY = y;
        
        if (timer.isOver) {
            timer.start();
            await sleep(0); //this makes it able to get shouldStop
            if (shouldStop) break;
        }
    }
    self.postMessage({finished: true, route});
}

function stop() {
    shouldStop = true;
}

const methods = {
    calculateRoute, stop
}

function getNextIndex(qt, [currentX, currentY], currentAngle, settings) {
    const { maxDistance, closenessWeight, directnessWeight, randomness } = settings;
    const availablePoints = findInCircle(qt, currentX, currentY, maxDistance/2, ([_x, _y, i]) => !visitedPoints.has(i));
    let bestScore = 0;
    let nextIndex;
    const maxDistance2 = maxDistance * maxDistance;
    availablePoints.forEach(([x, y, index]) => {
        const distance2 = (x-currentX) ** 2 + (y-currentY) ** 2;
        const angle = Math.atan2(y-currentY, x-currentX);
        const directness = Math.min(1, Math.cos(angle-currentAngle) / 2 + 0.5 + 0.01);
        const closeness = Math.min(1 - distance2 / maxDistance2 + 0.01);
        let score = (Math.pow(closeness, closenessWeight) + Math.pow(directness, directnessWeight))/2;
        score = lerp(randomness, score, Math.random());
        if (score <= bestScore) return;
        nextIndex = index;
        bestScore = score;
    });
    return nextIndex;
}
