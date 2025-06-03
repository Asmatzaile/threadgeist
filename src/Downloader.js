import { saveAs } from "file-saver";

export class Downloader {
    constructor(imageLoader, threader) {
        this.imageLoader = imageLoader;
        this.threader = threader;
    }

    download() {
        const { points, route } = this.threader.result;
        const { width, height, filename } = this.imageLoader.image;

        const name = filename.split('.').slice(0, -1).join('.');
        const svg = this.makePathSvg({width, height, points, route});
        const blob = this.svgToBlob(svg);
        saveAs(blob, name);
    }

    makePathSvg({width, height, points, route}) {
        const pointsString = route
        .map(pointIndex => `${points[pointIndex * 2]}, ${points[pointIndex * 2 + 1]}`)
        .join(" ");

        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttributeNS(null, 'width', width);
        svg.setAttributeNS(null, 'height', height);

        const polyline = document.createElementNS(ns, 'polyline');
        polyline.setAttributeNS(null, 'fill', 'none');
        polyline.setAttributeNS(null, 'stroke', '#000');
        polyline.setAttributeNS(null, 'points', pointsString);
        svg.appendChild(polyline);

        return svg;
    }

    svgToBlob(svgElement) {
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svgElement);
        return new Blob([svgString], { type: 'image/svg+xml' });
    }

}
