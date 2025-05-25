import { useForceUpdate } from "./useForceUpdate";
import { stippler } from "./index";

export function CreateStippleModal({ref, forceUpdate}) {
    const subForceUpdate = useForceUpdate();

    return <dialog ref={ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl">
        <form method="dialog">
            <fieldset>
                <legend>Stippler settings</legend>
                {[...Object.entries(stippler.settings)].map(([name, setting]) => {
                    return <label key={name}>
                        {name}
                        {setting.getWidget(newValue => {
                            setting.value = newValue;
                            subForceUpdate();
                        })}
                    </label>
                })}
            </fieldset>
            <button className="px-4 border-2 cursor-pointer" onClick={() => {
                stippler.createStipple(forceUpdate)
                forceUpdate();
            }}>Create stipple</button>
        </form>
            
    </dialog>
}