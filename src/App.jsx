import { useEffect, useRef, useState } from "react";
import { createDrawer, imageLoader, stippler, threader } from "./index"
import { CreatePathModal } from "./CreatePathModal";
import { CreateStippleModal } from "./CreateStippleModal";
import { useForceUpdate } from "./useForceUpdate";

function App() {
    const canvasRef = useRef();
    const createPathModalRef = useRef();
    const createStippleModalRef = useRef();

    const [imageUrls, setImageUrls] = useState();
    const [currentImageIndex, setCurrentImageIndex] = useState();
    useEffect(() => {
        createDrawer(canvasRef.current);
    }, [])

    const forceUpdate = useForceUpdate();
    function uploadImages(files) {
        setImageUrls(Array.from(files).map(URL.createObjectURL))
        setCurrentImageIndex(0);
    }
    useEffect(()=> {
        if (currentImageIndex === undefined) return;
        imageLoader.load(imageUrls[currentImageIndex], forceUpdate)
    }, [currentImageIndex, imageUrls]);

    return <>
        <h1>Threadgeist</h1>
        <label className="relative">
            <button className="px-4 border-2">Upload image(s)</button>
            <input type="file" accept="image/*" multiple={true} className="opacity-0 cursor-pointer absolute inset-0 w-full h-full" onChange={(e) => uploadImages(e.target.files)}/>
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

        { imageUrls && imageUrls.length > 1 && <>
            <button disabled={currentImageIndex===0} onClick={() => setCurrentImageIndex(p=>p-1)} className="px-4 border-2 enabled:cursor-pointer disabled:opacity-50">Previous</button>
            <span>Image {currentImageIndex+1} of {imageUrls.length}</span>
            <button disabled={currentImageIndex===imageUrls.length-1} onClick={() => setCurrentImageIndex(p=>p+1)}className="px-4 border-2 enabled:cursor-pointer disabled:opacity-50">Next</button>
        </>}

        <CreateStippleModal ref={createStippleModalRef} forceUpdate={forceUpdate}/>
        <CreatePathModal ref={createPathModalRef} forceUpdate={forceUpdate}/>
       
    </>
}

export default App
