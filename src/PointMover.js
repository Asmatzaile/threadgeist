export class PointMover {
    _hoveredPointIndex = undefined;
    isPointGrabbed = false;

    constructor(stippler, setCursor) {
        this.stippler = stippler;
        this.updateCursor = () => setCursor(this.hoveredPointIndex === undefined ? "default" : this.isPointGrabbed ? "grabbing" : "grab");
    }

    get hoveredPointIndex() { return this._hoveredPointIndex; }
    set hoveredPointIndex(value) {
        this._hoveredPointIndex = value;
        this.updateCursor()
        this.onchange();
    }

    grab() {
        if (!this.hoveredPointIndex) return;
        this.isPointGrabbed = true;
        this.updateCursor();
    }

    drop() {
        if (!this.isPointGrabbed) return;
        this.isPointGrabbed = false;
        this.updateCursor();
    }

    cancel() {
        this.drop();
        this.hoveredPointIndex = undefined;
    }

    move(x, y) {
        if (this.stippler.status !== "done") return;
        if (this.isPointGrabbed) this.dragPoint(x, y);
        else this.moveCursor(x, y);
    }

    moveCursor(x, y) {
        let prev = this.hoveredPointIndex;
        const closestPoint = this.getClosestPoint(x, y);
        if (closestPoint !== prev) this.hoveredPointIndex = closestPoint;
    }

    getClosestPoint(x, y) {
        let closestDistance = Infinity;
        let closestPointIndex;
        for (let i = 0; i < this.stippler.points.length / 2; i++) {
            const px = this.stippler.points[i*2];
            const py = this.stippler.points[i*2+1];
            const d = Math.sqrt(Math.pow(px-x, 2)+Math.pow(py-y, 2));
            if (d >= closestDistance) continue;
            closestDistance = d;
            closestPointIndex = i;
        }
        return closestDistance < 10 ? closestPointIndex : undefined;
    }

    dragPoint(x, y) {
        this.stippler.points[this.hoveredPointIndex*2] = x;
        this.stippler.points[this.hoveredPointIndex*2+1] = y;
        this.onchange();
    }
}
