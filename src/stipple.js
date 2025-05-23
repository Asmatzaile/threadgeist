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

import { Delaunay } from "d3-delaunay";

export function stipple(image, pointCount) {
    let points = createPoints(image, pointCount);
    points = relax(points, image);
    return points;
}

function createPoints(image, pointCount) {
    const points = new Float64Array(pointCount * 2);

    // Initialize the points using rejection sampling.
    for (let i = 0; i < pointCount; ++i) {
        for (let j = 0; j < 30; ++j) {
            const x = points[i * 2] = Math.floor(Math.random() * image.width);
            const y = points[i * 2 + 1] = Math.floor(Math.random() * image.height);
            if (Math.random() < image.data[y * image.width + x]) break;
        }
    }

    return points;
}

function relax(points, image) {
    const { width, height, data } = image;
    const delaunay = new Delaunay(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

    const n = points.length / 2; // pointCount
    const c = new Float64Array(n * 2);
    const s = new Float64Array(n);

    for (let k = 0; k < 80; ++k) {

        // Compute the weighted centroid for each Voronoi cell.
        c.fill(0);
        s.fill(0);
        for (let y = 0, i = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                const pixelIndex = y * width + x;
                const weight = data[pixelIndex];
                i = delaunay.find(x + 0.5, y + 0.5, i);
                s[i] += weight;
                c[i * 2] += weight * (x + 0.5);
                c[i * 2 + 1] += weight * (y + 0.5);
            }
        }

        // Relax the diagram by moving points to the weighted centroid.
        // Wiggle the points a little bit so they don’t get stuck.
        const w = Math.pow(k + 1, -0.8) * 10;
        for (let i = 0; i < n; ++i) {
            const x0 = points[i * 2], y0 = points[i * 2 + 1];
            const x1 = s[i] ? c[i * 2] / s[i] : x0, y1 = s[i] ? c[i * 2 + 1] / s[i] : y0;
            points[i * 2] = x0 + (x1 - x0) * 1.8 + (Math.random() - 0.5) * w;
            points[i * 2 + 1] = y0 + (y1 - y0) * 1.8 + (Math.random() - 0.5) * w;
        }

        voronoi.update();
    }

    return points;
}
