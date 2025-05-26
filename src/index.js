import { Drawer } from "./Drawer";
import { ImageLoader } from "./ImageLoader";
import { Stippler } from "./Stippler";
import { Threader } from "./Threader";


export const imageLoader = new ImageLoader();
export const stippler = new Stippler(imageLoader);
export const threader = new Threader(stippler);

export function createDrawer(canvas) {
    const drawer = new Drawer(canvas, stippler, threader);
    stippler.onstep = () => drawer.updatePoints();
    threader.onstep = () => drawer.updatePath();
    imageLoader.drawer = drawer;
}
