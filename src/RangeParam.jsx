import { round, lin2log, log2lin } from "./utils";

export class RangeParam {
    constructor(min, max, value, step="any") {
        this.min = min;
        this.max = max;
        this.value = value;
        this.step = step;
    }

    valueOf() {
        return this.value;
    }


    getWidget(onUpdate) {
        return <Slider className="cursor-pointer" min="0" max="1" step="any"
        value={log2lin(this.value, this.min, this.max)} displayValue={this.value}
        onChange={e => onUpdate(round(lin2log(e.target.valueAsNumber, this.min, this.max), this.step))} />
    }
}

const Slider = ({className, min, max, step, value, displayValue, onChange}) => {
    return <>
        <input className={className} type="range" min={min} max={max} step={step} value={value} onChange={onChange} />
        <div>{parseFloat(displayValue.toFixed(2)).toString()}</div>
    </>

}
