import { useHotkeys } from "react-hotkeys-hook";
import { XIcon } from "@phosphor-icons/react";
import { useForceUpdate } from "./useForceUpdate";
import { stippler } from "./index";
import { Button } from "./components/Button";
import { Legend } from "./components/Legend";
import { Dialog } from "./components/Dialog";

export function CreateStippleModal({ref, createStipple}) {
    const subForceUpdate = useForceUpdate();
    useHotkeys('enter', () => {
        if (!ref.current || !ref.current.open) return;
        ref.current.close();
        createStipple();
    });

    return <Dialog ref={ref}>
        <form method="dialog" className="flex flex-col gap-2">
            <fieldset className="grid gap-2 items-baseline grid-cols-[auto_auto]">
                <Legend className="uppercase">Stippler settings</Legend>
                <Button className="shadow-none justify-self-end w-min !p-1" onClick={() => ref.current.close()}><XIcon weight="bold"></XIcon></Button>
                <div className="col-span-2 flex flex-col">
                    {[...Object.entries(stippler.settings)].map(([name, setting]) => {
                        return <label key={name}>
                            <span className="mr-2">{name}</span>
                            {setting.getWidget(newValue => {
                                setting.value = newValue;
                                subForceUpdate();
                            })}
                        </label>
                    })}
                </div>
            </fieldset>
            <Button variant="primary" onClick={createStipple}>Create stipple</Button>
        </form>
            
    </Dialog>
}