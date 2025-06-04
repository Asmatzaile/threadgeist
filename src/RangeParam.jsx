import { round, lin2log, log2lin, lerp, normalize } from "./utils";
import { Slider } from "./components/Slider";
export class RangeParam {
    constructor(min, max, value, {step="any", display='slider', scale='exponential'}={}) {
        this.min = min;
        this.max = max;
        this.value = value;
        this.step = step;
        this.display = display;
        this.scale = scale;
    }

    valueOf() {
        return this.value;
    }

    getWidget(onUpdate) {
        if (this.display === 'slider') return this.getSliderWidget(onUpdate);
        if (this.display === 'box') return this.getBoxWidget(onUpdate);
    }

    getSliderWidget(onUpdate) {
        function num2Norm(value, param) {
            if (param.scale === 'exponential') return log2lin(value, param.min, param.max);
            if (param.scale === 'linear') return normalize(value, param.min, param.max);
        }
        function norm2Num(value, param) {
            const numValue = param.scale === 'exponential' ? lin2log(value, param.min, param.max) : lerp(value, param.min, param.max);
            return round(numValue, param.step);
        }
        return <Slider className="cursor-pointer" min="0" max="1" step="any"
            value={num2Norm(this.value, this)} displayValue={this.value}
            onChange={e => onUpdate(norm2Num(e.target.valueAsNumber, this))} />
    }
    getBoxWidget(onUpdate) {
        return <input type="number" min={this.min} max={this.max} step={this.step} value={this.value} onChange={e => onUpdate(e.target.valueAsNumber)}/>
    }
}
