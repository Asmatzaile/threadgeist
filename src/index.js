import { Drawer } from "./Drawer";
import { ImageLoader } from "./ImageLoader";
import { Stippler } from "./Stippler";
import { Threader } from "./Threader";


export const imageLoader = new ImageLoader();
export const stippler = new Stippler(imageLoader);
export const threader = new Threader(stippler);

let drawer;
export function createDrawer(canvas) {
    drawer = new Drawer(canvas, stippler, threader);
    stippler.onstep = () => drawer.updateCanvas();
    threader.onstart = () => drawer.updateCanvas();
    threader.onstep = () => drawer.updateCanvas({solo: ["route"]});
    imageLoader.drawer = drawer;
}
