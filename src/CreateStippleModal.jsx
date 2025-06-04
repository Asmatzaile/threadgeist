import { useForceUpdate } from "./useForceUpdate";
import { stippler } from "./index";
import { Button } from "./components/Button";

export function CreateStippleModal({ref, forceUpdate}) {
    const subForceUpdate = useForceUpdate();

    return <dialog ref={ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl">
        <form method="dialog">
            <fieldset className="flex flex-col">
                <legend>Stippler settings</legend>
                {[...Object.entries(stippler.settings)].map(([name, setting]) => {
                    return <label key={name}>
                        <span className="mr-2">{name}</span>
                        {setting.getWidget(newValue => {
                            setting.value = newValue;
                            subForceUpdate();
                        })}
                    </label>
                })}
            </fieldset>
            <Button variant="primary" onClick={() => {
                stippler.createStipple(forceUpdate)
                forceUpdate();
            }}>Create stipple</Button>
        </form>
            
    </dialog>
}