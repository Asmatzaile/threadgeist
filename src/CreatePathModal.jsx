import { useForceUpdate } from "./useForceUpdate";
import { threader } from "./index";

export function CreatePathModal({ref, forceUpdate}) {
    const subForceUpdate = useForceUpdate();

    return <dialog ref={ref}  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl">
        <form method="dialog">
            <fieldset>
                <legend>Threader settings</legend>
                {[...Object.entries(threader.settings)].map(([name, setting]) => {
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
                threader.createRoute(forceUpdate)
                forceUpdate();
            }}>Create path</button>
        </form>
            
    </dialog>
}