export const Slider = ({displayValue, ...params}) => {
    return <>
        <input type="range" {...params} />
        {displayValue && <div>{parseFloat(displayValue.toFixed(2)).toString()}</div>}
    </>

}
