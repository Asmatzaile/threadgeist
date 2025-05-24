const image = new Image();
image.crossOrigin = "anonymous";
image.src = "https://static.observableusercontent.com/files/14959f050311f400368624031a7b9e4285f35c65ca4022f618f9250d7163ef4b0a0582de20f7d9790ed76b3442b4a77ebb96b86f641c1d8466f6544325144aed?response-content-disposition=attachment%3Bfilename*%3DUTF-8%27%27obama.png";

const canvas = document.createElement("canvas");
canvas.width = image.width;
canvas.height = image.height;
const context = canvas.getContext("2d");
document.body.appendChild(canvas);


const pointCount = 10000;
const stippler = new Worker(new URL("./stipple.js", import.meta.url), {type: 'module'});
const threader = new Worker(new URL("./thread.js", import.meta.url), {type: 'module'});

let ppoints;
stippler.addEventListener("message", ({data}) => {
    const { points, finished } = data;
    drawPoints(points);
    if (!finished) return;
    const imgDiagonal = Math.sqrt(Math.pow(image.width, 2) + Math.pow(image.height, 2));
    ppoints = points;
    threader.postMessage({ points, imgDiagonal })
});

threader.addEventListener("message", ({data}) => {
    const { route, finished } = data;
    drawRoute(ppoints, route);
    if (finished) console.log("finished!");
});

image.onload = () => {
    const parsedImage = parseImage(image);
    stippler.postMessage({image: parsedImage, pointCount});
}

function parseImage(image) {
    const canvas = document.createElement("canvas");
    const { width, height } = image;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    context.drawImage(image, 0, 0);
    const { data: rgba } = context.getImageData(0, 0, width, height);
    const data = new Float64Array(width * height);
    for (let i = 0, n = rgba.length / 4; i < n; ++i) {
        const [r, g, b, _a] = rgba.slice(i*4, i*4 + 4);
        const luminance = 0.2126 * r/255 + 0.7152 * g/255 + 0.0722 * b/255; // Rec. 709
        data[i] =  1 - luminance;
    }

    return { data, width, height };
}

function drawPoints(points) {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.beginPath();
    for (let i = 0, n = points.length; i < n; i += 2) {
        const x = points[i], y = points[i + 1];
        context.moveTo(x + 1.5, y);
        context.arc(x, y, 1.5, 0, 2 * Math.PI);
    }
    context.fillStyle = "#000";
    context.fill();
}

function drawRoute(points, route) {
    context.beginPath();
    route.forEach((pointIndex, i) => {
        const [x, y] = [points[pointIndex*2], points[pointIndex*2+1]];
        if (i === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
    })
    context.strokeStyle = "#f00"
    context.stroke();
}
