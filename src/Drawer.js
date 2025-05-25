export class Drawer {

    constructor(canvas, stippler, threader) {
        this.context = canvas.getContext("2d");
        this.stippler = stippler;
        this.threader = threader;
        window.clearBg = () => this.clearBg();
    }
    updateCanvas({solo}={}) {
        if (!solo) if (this.stippler.points) this.drawPoints(this.stippler.points, this.context);
        if (!solo || solo.includes("route")) if (this.threader.route) this.drawRoute(this.stippler.points, this.threader.route, this.context);
    }
    updateDim({width, height}) {
        const canvas = this.context.canvas;
        canvas.width = width;
        canvas.height = height;
        this.updateCanvas();
    }

    drawPoints(points, context=this.context) {
        this.clearBg();
        context.beginPath();
        for (let i = 0, n = points.length; i < n; i += 2) {
            const x = points[i], y = points[i + 1];
            context.moveTo(x + 1.5, y);
            context.arc(x, y, 1.5, 0, 2 * Math.PI);
        }
        context.fillStyle = "#000";
        context.fill();
    }

    clearBg(context=this.context) {
        context.fillStyle = "#fff";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
    
    drawRoute(points, route, context=this.context) {
        context.beginPath();
        route.forEach((pointIndex, i) => {
            const [x, y] = [points[pointIndex * 2], points[pointIndex * 2 + 1]];
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
        })
        context.strokeStyle = "#f00"
        context.stroke();
    }
    
}