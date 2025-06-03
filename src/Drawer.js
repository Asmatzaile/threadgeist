import { PointMover } from "./PointMover";

export class Drawer {
    canvases = new Map();

    constructor(previewDiv, setCursor, stippler, threader) {
        const names = ["image", "stipple", "path"];
        [...previewDiv.children].forEach((canvas, index) => this.canvases.set(names[index], canvas));

        this.stippler = stippler;
        this.threader = threader;

        const pointMover = new PointMover(stippler, setCursor);
        pointMover.onchange = () => this.updatePoints();
        previewDiv.addEventListener("pointerdown", () => pointMover.grab())
        previewDiv.addEventListener("pointerup", () => pointMover.drop())
        previewDiv.addEventListener("pointerout", () => pointMover.cancel())
        previewDiv.addEventListener("pointermove", e => pointMover.move(e.offsetX, e.offsetY)); // TODO: if canvas is not same size as image this won't work
        this.pointMover = pointMover;
    }

    updateDim({width, height}) {
        this.canvases.forEach((canvas, _name) => {
            canvas.width = width;
            canvas.height = height;
        })
        this.drawImage(this.stippler.image);
        this.updatePoints();
    }

    updatePoints() {
        if (this.stippler.points) this.drawPoints(this.stippler.points);
        this.updatePath();
    }

    updatePath() {
        if (this.stippler.points && this.threader.route) this.drawRoute(this.stippler.points, this.threader.route);
    }

    drawImage(image) {
        const {data: grayscaleData, width, height} = image;
        const dataArray = new Uint8ClampedArray(grayscaleData.length*4);
        grayscaleData.forEach((normValue, index) => {
            const value = Math.floor(normValue*256);
            dataArray[index*4] = value;
            dataArray[index*4+1] = value;
            dataArray[index*4+2] = value;
            dataArray[index*4+3] = 255;
        });
        const imageData = new ImageData(dataArray, width, height);
        const context = this.canvases.get("image").getContext("2d");
        context.putImageData(imageData, 0, 0);
    }

    drawPoints(points) {
        const context = this.canvases.get("stipple").getContext("2d");
        this.clearBg(context);
        context.beginPath();
        const r = 1.5;
        for (let i = 0, n = points.length; i < n; i += 2) {
            const x = points[i], y = points[i + 1];
            let radius = r;
            if (this.pointMover.hoveredPointIndex === i/2) radius *= 2;
            context.moveTo(x + radius, y);
            context.arc(x, y, radius, 0, 2 * Math.PI);
        }
        context.fillStyle = "#66f";
        context.fill();
    }

    
    drawRoute(points, route) {
        const context = this.canvases.get("path").getContext("2d");
        this.clearBg(context);
        context.beginPath();
        route.forEach((pointIndex, i) => {
            const [x, y] = [points[pointIndex * 2], points[pointIndex * 2 + 1]];
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
        })
        context.strokeStyle = "#f00"
        context.stroke();
    }

    clearBg = context => context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    setOpacity(canvas, level) {

    }
}
