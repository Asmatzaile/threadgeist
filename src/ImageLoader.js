export class ImageLoader {
    status = 'unstarted';

    load(url, filename, onload) {
        this.status = 'working';
        const rawImage = new Image();
        rawImage.crossOrigin = "anonymous";
        rawImage.src = url;
        rawImage.onload = () => {
            this.image = this.parseImage(rawImage);
            this.image.filename = filename;

            this.drawer.updateDim({width: this.image.width, height: this.image.height});

            this.status = 'done';
            onload();
        }
    }

    parseImage(rawImage) {
        const canvas = document.createElement("canvas");
        const { width, height } = rawImage;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.drawImage(rawImage, 0, 0);
        const { data: rgba } = context.getImageData(0, 0, width, height);
        const data = new Float64Array(width * height);
        for (let i = 0, n = rgba.length / 4; i < n; ++i) {
            const [r, g, b, _a] = rgba.slice(i * 4, i * 4 + 4);
            const luminance = 0.2126 * r / 255 + 0.7152 * g / 255 + 0.0722 * b / 255; // Rec. 709
            data[i] = luminance;
        }

        return { data, width, height };
    }

}
