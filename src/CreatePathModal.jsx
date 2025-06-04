import { useForceUpdate } from "./useForceUpdate";
import { threader } from "./index";
import { Button } from "./components/Button";

export function CreatePathModal({ref, forceUpdate}) {
    const subForceUpdate = useForceUpdate();

    return <dialog ref={ref}  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl">
        <form method="dialog">
            <fieldset className="flex flex-col">
                <legend>Threader settings</legend>
                {[...Object.entries(threader.settings)].map(([name, setting]) => {
                    return <label key={name}>
                        <span className="mr-2">{name}</span>
                        {setting.getWidget(newValue => {
                            setting.value = newValue;
                            subForceUpdate();
                        })}
                    </label>
                })}
            </fieldset>
            <Button onClick={() => {
                threader.createRoute(forceUpdate)
                forceUpdate();
            }}>Create path</Button>
        </form>
            
    </dialog>
}