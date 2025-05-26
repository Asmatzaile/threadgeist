import { useEffect, useRef, useState } from "react";
import { createDrawer, imageLoader, stippler, threader } from "./index"
import { CreatePathModal } from "./CreatePathModal";
import { CreateStippleModal } from "./CreateStippleModal";
import { useForceUpdate } from "./useForceUpdate";
import { Button } from "./components/Button";
import { Slider } from "./components/Slider";

function App() {
    const previewRef = useRef();
    const createPathModalRef = useRef();
    const createStippleModalRef = useRef();

    const [images, setImages] = useState();
    const [currentImageIndex, setCurrentImageIndex] = useState();
    useEffect(() => {
        createDrawer(previewRef.current);
    }, [])

    const forceUpdate = useForceUpdate();
    function uploadImages(files) {
        setImages(Array.from(files).map(file => ({name: file.name, url: URL.createObjectURL(file)})))
        setCurrentImageIndex(0);
    }
    useEffect(()=> {
        if (currentImageIndex === undefined) return;
        imageLoader.load(images[currentImageIndex].url, forceUpdate)
    }, [currentImageIndex, images]);

    const [imgOpacity, setImgOpacity] = useState(1);
    const [stippleOpacity, setStippleOpacity] = useState(1);
    const [pathOpacity, setPathOpacity] = useState(1);


    return <>
        <header className="py-2 border-b-2">
            <h1 className="font-bold ml-2">🧵👻 - Threadgeist</h1>
        </header>
        <div className="grid grid-cols-3 gap-6 border-b-2 *:border-r-2">
            <fieldset className="p-2 grid gap-2 items-center">
                <legend className="uppercase">Image</legend>
                <label className="relative w-full">
                    <Button className="w-full">Upload image(s)</Button>
                    <input type="file" accept="image/*" multiple={true} className="opacity-0 cursor-pointer absolute inset-0 w-full h-full" onChange={(e) => uploadImages(e.target.files)}/>
                </label>
                { images && images.length === 1 && <span className="grid justify-center">{images[currentImageIndex].name}</span>}
                { images && images.length > 1 && <div className="grid justify-between grid-cols-[min-content_minmax(max-content,auto)_min-content]">
                <Button aria-label="Previous image" disabled={currentImageIndex===0} onClick={() => setCurrentImageIndex(p=>p-1)}>◀</Button>
                <span className="mx-2">{images[currentImageIndex].name} ({currentImageIndex+1}/{images.length})</span>
                <Button aria-label="Next image" disabled={currentImageIndex===images.length-1} onClick={() => setCurrentImageIndex(p=>p+1)}>▶</Button>
                </div>}
            </fieldset>
            <fieldset className="p-2 grid gap-2 items-center" disabled={imageLoader.status === 'unstarted'}>
                <legend className="uppercase">Stippler</legend>
                <Button disabled={stippler.status === 'working' || threader.status === 'working'} onClick={() => createStippleModalRef.current.showModal()}>New stipple</Button>
                <Button hidden={stippler.status !== 'done'} onClick={() => {stippler.relax(forceUpdate);forceUpdate()}}>Relax stipple</Button>
                <Button hidden={stippler.status !== 'working'} onClick={() => stippler.stop()}>Stop relaxation</Button>
            </fieldset>
            <fieldset className="p-2 grid gap-2 items-center" disabled={stippler.status === 'unstarted'}>
                <legend className="uppercase">Threader</legend>
                <Button hidden={threader.status === 'working'} onClick={() => createPathModalRef.current.showModal()}>New path</Button>
                <Button hidden={threader.status !== 'working'} onClick={() => threader.stop()}>Stop path generation</Button>
            </fieldset>
        </div>

        <div>
            <h3 className="preview">Preview</h3>
            <div hidden={!imageLoader.status === 'unstarted'} className="relative" ref={previewRef}>
                    <canvas style={{opacity: imgOpacity}} />
                    <canvas style={{opacity: stippleOpacity}}  className="absolute inset-0"/>
                    <canvas style={{opacity: pathOpacity}}  className="absolute inset-0"/>
            </div>
            <fieldset>
                <legend className="uppercase">Opacity</legend>
                <label>
                    Image
                    <Slider disabled={imageLoader.status === 'unstarted'} min="0" max="1" step="any" value={imgOpacity} onChange={(e)=>setImgOpacity(e.target.valueAsNumber)}/>
                </label>
                <label>
                    Stipple
                    <Slider disabled={stippler.status === 'unstarted'} min="0" max="1" step="any" value={stippleOpacity} onChange={(e)=>setStippleOpacity(e.target.valueAsNumber)}/>
                </label>
                <label>
                    Path
                    <Slider disabled={threader.status === 'unstarted'} min="0" max="1" step="any" value={pathOpacity} onChange={(e)=>setPathOpacity(e.target.valueAsNumber)}/>
                </label>
            </fieldset>
        </div>


        <CreateStippleModal ref={createStippleModalRef} forceUpdate={forceUpdate}/>
        <CreatePathModal ref={createPathModalRef} forceUpdate={forceUpdate}/>
       
    </>
}

export default App
