import { Delaunay } from "d3-delaunay";
import { lerp, sleep } from "./utils";

self.onmessage = event => {
    const {data: { name, args }} = event;
    if (methods[name]) return methods[name](args);
    console.error(`Unknown method: ${name}`);
}

const methods = { relax, stop };

let shouldStop;
function stop() {
    shouldStop = true;
}

// Copyright 2018–2020 Mike Bostock
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.

// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

async function relax({points, image, steps}) {
    shouldStop = false;
    const delaunay = new Delaunay(points);
    const voronoi = delaunay.voronoi([0, 0, image.width, image.height]);

    const n = points.length / 2; // pointCount
    const c = new Float64Array(n * 2);
    const s = new Float64Array(n);

    for (let k = 0; k < steps; ++k) {
        const wiggle = Math.pow(k + 1, -0.8) / 100;
        points = relaxStep(voronoi, c, s, image, wiggle);
        self.postMessage({points});

        await sleep(0);
        if (shouldStop) break;
    }

    self.postMessage({finished: true, points})
}

function relaxStep(voronoi, c, s, image, wiggle=0) {
    const delaunay = voronoi.delaunay;
    const points = delaunay.points;
    const {width, height, data} = image;
    // Compute the weighted centroid for each Voronoi cell.
    c.fill(0);
    s.fill(0);
    for (let y = 0, i = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            const pixelIndex = y * width + x;
            const weight = data[pixelIndex];
            const xCenter = x + 0.5;
            const yCenter = y + 0.5;
            i = delaunay.find(xCenter, yCenter, i);
            s[i] += weight;
            c[i * 2] += weight * xCenter;
            c[i * 2 + 1] += weight * yCenter;
        }
    }

    for (let i = 0; i < points.length/2; ++i) {
        // Relax the diagram by moving points to the weighted centroid.
        const x0 = points[i * 2], y0 = points[i * 2 + 1];
        const x1 = s[i] ? c[i * 2] / s[i] : x0, y1 = s[i] ? c[i * 2 + 1] / s[i] : y0;
        points[i * 2] = lerp(1.8, x0, x1);
        points[i * 2 + 1] = lerp(1.8, y0, y1);

        // Wiggle the points a little bit so they don't get stuck
        points[i * 2] += (Math.random() - 0.5) * wiggle * width;
        points[i * 2 + 1] += (Math.random() - 0.5) * wiggle * height;
    }
    voronoi.update();

    return points;
}
