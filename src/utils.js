const scale = (input, inmin, inmax, outmin, outmax) => lerp((normalize(input, inmin, inmax)), outmin, outmax)
const normalize = (input, inmin, inmax) => (input - inmin) / (inmax - inmin);
export const lerp = (t, a, b) => a + t * (b - a);

export const round = (value, step=1, offset=0) => step === "any" ? value : Math.ceil((value-offset) / step) * step + offset;

// assumes lin value is normalized
export function lin2log(value, min, max) {
    return lerp(Math.pow(value, 2), min, max);
}

export function log2lin(value, min, max) {
    return Math.pow(normalize(value, min, max), 1/2);
}

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
