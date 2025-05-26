export class Drawer {
    canvases = new Map();

    constructor(previewDiv, stippler, threader) {
        const names = ["image", "stipple", "path"];
        [...previewDiv.children].forEach((canvas, index) => this.canvases.set(names[index], canvas));

        this.stippler = stippler;
        this.threader = threader;
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
        for (let i = 0, n = points.length; i < n; i += 2) {
            const x = points[i], y = points[i + 1];
            context.moveTo(x + 1.5, y);
            context.arc(x, y, 1.5, 0, 2 * Math.PI);
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
