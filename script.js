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


import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const image = new Image();
image.crossOrigin = "anonymous";
image.src = "https://static.observableusercontent.com/files/14959f050311f400368624031a7b9e4285f35c65ca4022f618f9250d7163ef4b0a0582de20f7d9790ed76b3442b4a77ebb96b86f641c1d8466f6544325144aed?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27obama.png";

image.onload = () => stipple();

function stipple() {
    const width = image.width;
    const height = image.height;

    const data = getImageData(image);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    document.body.appendChild(canvas);

    function getImageData(image) {
        const canvas = document.createElement("canvas");
        const { width, height } = image;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0);
        const { data: rgba } = context.getImageData(0, 0, width, height);
        const data = new Float64Array(width * height);
        for (let i = 0, n = rgba.length / 4; i < n; ++i) data[i] = Math.max(0, 1 - rgba[i * 4] / 254);

        return data;
    }


    const n = Math.round(width * height / 40);

    const points = new Float64Array(n * 2);
    const c = new Float64Array(n * 2);
    const s = new Float64Array(n);

    // Initialize the points using rejection sampling.
    for (let i = 0; i < n; ++i) {
        for (let j = 0; j < 30; ++j) {
            const x = points[i * 2] = Math.floor(Math.random() * width);
            const y = points[i * 2 + 1] = Math.floor(Math.random() * height);
            if (Math.random() < data[y * width + x]) break;
        }
    }

    const delaunay = new d3.Delaunay(points);
    const voronoi = delaunay.voronoi([0, 0, width, height]);

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

        drawPoints(points);
        voronoi.update();
    }

    function drawPoints(points) {
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, height);
        context.beginPath();
        for (let i = 0, n = points.length; i < n; i += 2) {
            const x = points[i], y = points[i + 1];
            context.moveTo(x + 1.5, y);
            context.arc(x, y, 1.5, 0, 2 * Math.PI);
        }
        context.fillStyle = "#000";
        context.fill();
    }
}
