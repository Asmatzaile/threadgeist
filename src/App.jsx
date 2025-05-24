import { useRef } from "react";
import { loadImage, getStippler, getThreader } from "./index"
import { useForceUpdate } from "./useForceUpdate";

function App() {
    const canvasRef = useRef();

    function uploadImage(file) {
        const blobURL = URL.createObjectURL(file);
        loadImage(blobURL, canvasRef.current);
    }
    const stippler = getStippler();
    const threader = getThreader();
    const forceUpdate = useForceUpdate();
    return <>
        <h1>Threadgeist</h1>
        <label className="relative">
            <button className="px-4 border-2">Upload image</button>
            <input type="file" accept="image/*" multiple={false} className="opacity-0 cursor-pointer absolute inset-0 w-full h-full bg-sky-300" onChange={(e) => uploadImage(e.target.files[0])}/>
        </label>
        <canvas ref={canvasRef} />
        <fieldset>
            <legend>Stippler settings</legend>
            {[...Object.entries(stippler.settings)].map(([name, setting]) => {
                return <label key={name}>
                    {name}
                    {setting.getWidget(newValue => {
                        setting.value = newValue;
                        forceUpdate();
                    })}
                </label>
            })}
        </fieldset>
        <fieldset>
            <legend>Threader settings</legend>
            {[...Object.entries(threader.settings)].map(([name, setting]) => {
                return <label key={name}>
                    {name}
                    {setting.getWidget(newValue => {
                        setting.value = newValue;
                        forceUpdate();
                    })}
                </label>
            })}
        </fieldset>
    </>
}

export default App
