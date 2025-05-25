import { useEffect, useRef } from "react";
import { createDrawer, imageLoader, stippler, threader } from "./index"
import { CreatePathModal } from "./CreatePathModal";
import { CreateStippleModal } from "./CreateStippleModal";
import { useForceUpdate } from "./useForceUpdate";

function App() {
    const canvasRef = useRef();
    const createPathModalRef = useRef();
    const createStippleModalRef = useRef();

    useEffect(() => {
        createDrawer(canvasRef.current);
    }, [])

    const forceUpdate = useForceUpdate();
    function uploadImage(file) {
        const blobURL = URL.createObjectURL(file);
        imageLoader.load(blobURL, forceUpdate);
    }
    return <>
        <h1>Threadgeist</h1>
        <label className="relative">
            <button className="px-4 border-2">Upload image</button>
            <input type="file" accept="image/*" multiple={false} className="opacity-0 cursor-pointer absolute inset-0 w-full h-full bg-sky-300" onChange={(e) => uploadImage(e.target.files[0])}/>
        </label>
        <canvas hidden={!imageLoader.status === 'unstarted'} ref={canvasRef} />
        
        {imageLoader.status === 'done' && <>
            {stippler.status !== 'working' && <button className="px-4 border-2 cursor-pointer" onClick={() => createStippleModalRef.current.showModal()}>New stipple</button>}
            <div>
                {stippler.status === 'done' && <button className="px-4 border-2 cursor-pointer" onClick={() => {
                    stippler.relax(forceUpdate);
                    forceUpdate();
                    }}>Relax stipple</button>}
                {stippler.status === 'working'  && <button className="px-4 border-2 cursor-pointer" onClick={() => stippler.stop()}>Stop relaxation</button>}            
            </div>
            { stippler.status !== 'unstarted' &&
                <div>
                    {threader.status !== 'working' && <button className="px-4 border-2 cursor-pointer" onClick={() => createPathModalRef.current.showModal()}>New path</button>}
                    {threader.status === 'working' && <button className="px-4 border-2 cursor-pointer" onClick={() => threader.stop()}>Stop path generation</button>}
                </div>
            }
        </>}

        <CreateStippleModal ref={createStippleModalRef} forceUpdate={forceUpdate}/>
        <CreatePathModal ref={createPathModalRef} forceUpdate={forceUpdate}/>
       
    </>
}

export default App
