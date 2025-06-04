import { useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { imageLoader, stippler, threader, downloader } from "./index";
import { createDrawer } from "./index";
import { CreatePathModal } from "./CreatePathModal";
import { CreateStippleModal } from "./CreateStippleModal";
import { useForceUpdate } from "./useForceUpdate";
import { Button } from "./components/Button";
import { Slider } from "./components/Slider";
import { Legend } from "./components/Legend";
import { sleep } from "./utils";

function App() {
    const previewRef = useRef();
    const [previewCursor, setPreviewCursor] = useState("default");
    const createPathModalRef = useRef();
    const createStippleModalRef = useRef();

    const [images, setImages] = useState();
    const [currentImageIndex, setCurrentImageIndex] = useState();

    useEffect(() => {
        createDrawer(previewRef.current, setPreviewCursor);
    }, [])

    const forceUpdate = useForceUpdate();
    function uploadImages(files) {
        setImages(Array.from(files).map(file => ({filename: file.name, url: URL.createObjectURL(file)})))
        setCurrentImageIndex(0);
    }
    useEffect(()=> {
        if (currentImageIndex === undefined) return;
        const currentImg = images[currentImageIndex];
        imageLoader.load(currentImg.url, currentImg.filename, forceUpdate)
    }, [currentImageIndex, images]);

    const [imgOpacity, setImgOpacity] = useState(1);
    const [stippleOpacity, setStippleOpacity] = useState(1);
    const [pathOpacity, setPathOpacity] = useState(1);


    const actions = {
        STIPPLE: {
            action: ()=>{stippler.createStipple(forceUpdate), forceUpdate()},
            enabled: imageLoader.status !== 'unstarted' && stippler.status !== 'working' && threader.status !== 'working',
            hotkey: 's',
        },
        RELAX_STIPPLE: {
            action: ()=>{stippler.relax(forceUpdate), forceUpdate()},
            enabled: stippler.status === 'done',
            hotkey: 'r',
        },
        CREATE_PATH: {
            action: ()=>{threader.createRoute(forceUpdate),forceUpdate()},
            enabled: stippler.status !== 'unstarted' && threader.status !== 'working',
            hotkey: 'p',
        },
        DOWNLOAD_PATH: {
            action: ()=>downloader.download(),
            enabled: threader.status === 'done',
            hotkey: 'd',
        },
        PREVIOUS_IMAGE: {
            action: () => setCurrentImageIndex(p=>p-1),
            enabled: currentImageIndex > 0,
            hotkey: 'left',
        },
        NEXT_IMAGE: {
            action: () => setCurrentImageIndex(p=>p+1),
            enabled: images && currentImageIndex < images.length-1,
            hotkey: 'right',
        },
    };
    const macros = {
        STIPPLE_AND_PATH: {
            action: async() => {
                actions.STIPPLE.action();
                await sleep(300);
                actions.CREATE_PATH.action();
            },
            enabled: actions.STIPPLE.enabled,
            hotkey: 'shift+s',
        },
        DOWNLOAD_AND_NEXT: {
            action: () => {
                actions.DOWNLOAD_PATH.action();
                if (!actions.NEXT_IMAGE.enabled) return;
                actions.NEXT_IMAGE.action();
            },
            enabled: actions.DOWNLOAD_PATH.enabled,
            hotkey: 'shift+d',
        },
        EVERYTHING: {
            action: async() => {
                if (macros.DOWNLOAD_AND_NEXT.enabled) {
                    macros.DOWNLOAD_AND_NEXT.action();
                    if (!actions.NEXT_IMAGE.enabled) return;
                    await sleep(100);
                } 
                if (macros.STIPPLE_AND_PATH.enabled) await macros.STIPPLE_AND_PATH.action();
            },
            hotkey: 'e',
        }
    };

    [...Object.values(actions)].forEach(({action, enabled, hotkey}) => useHotkeys(hotkey, ()=>action(), {enabled}));
    [...Object.values(macros)].forEach(({action, enabled, hotkey}) => useHotkeys(hotkey, ()=>action(), {enabled}));


    return <>
        <header className="py-2 border-b-2">
            <h1 className="font-bold ml-2">🧵👻 - Threadgeist</h1>
        </header>
        <div className="grid grid-cols-3 gap-6 border-b-2 *:border-r-2">
            <fieldset className="p-2 grid gap-2 items-center">
                <Legend className="uppercase">Image</Legend>
                <label className="relative w-full">
                    <Button className="w-full">Upload image(s)</Button>
                    <input type="file" accept="image/*" multiple={true} className="opacity-0 cursor-pointer absolute inset-0 w-full h-full" onChange={(e) => uploadImages(e.target.files)}/>
                </label>
                { images && images.length === 1 && <span className="grid justify-center">{images[currentImageIndex].filename}</span>}
                { images && images.length > 1 && <div className="grid justify-between grid-cols-[min-content_minmax(max-content,auto)_min-content]">
                <Button aria-label="Previous image" disabled={!actions.PREVIOUS_IMAGE.enabled} onClick={()=>actions.PREVIOUS_IMAGE.action()}>◀</Button>
                <span className="mx-2">{images[currentImageIndex].filename} ({currentImageIndex+1}/{images.length})</span>
                <Button aria-label="Next image" disabled={!actions.NEXT_IMAGE.enabled} onClick={() =>actions.NEXT_IMAGE.action()}>▶</Button>
                </div>}
            </fieldset>
            <fieldset className="p-2 grid gap-2 items-center" disabled={imageLoader.status === 'unstarted'}>
                <Legend className="uppercase">Stippler</Legend>
                <Button disabled={!actions.STIPPLE.enabled} onClick={() => createStippleModalRef.current.showModal()}>New stipple</Button>
                <Button hidden={stippler.status !== 'done'} onClick={() => actions.RELAX_STIPPLE.action()}>Relax stipple</Button>
                <Button hidden={stippler.status !== 'working'} onClick={() => stippler.stop()}>Stop relaxation</Button>
            </fieldset>
            <fieldset className="p-2 grid gap-2 items-center" disabled={stippler.status === 'unstarted'}>
                <Legend className="uppercase">Threader</Legend>
                <Button hidden={threader.status === 'working'} onClick={() => createPathModalRef.current.showModal()}>New path</Button>
                <Button hidden={threader.status !== 'working'} onClick={() => threader.stop()}>Stop path generation</Button>
                <Button hidden={threader.status === 'unstarted'} disabled={!actions.DOWNLOAD_PATH.enabled} onClick={() => actions.DOWNLOAD_PATH.action()}>Download path svg</Button>
            </fieldset>
        </div>

        <div>
            <h3 className="preview">Preview</h3>
            <div hidden={!imageLoader.status === 'unstarted'} className="relative w-min" ref={previewRef} style={{cursor: previewCursor}}>
                    <canvas style={{opacity: imgOpacity}} />
                    <canvas style={{opacity: stippleOpacity}}  className="absolute inset-0"/>
                    <canvas style={{opacity: pathOpacity}}  className="absolute inset-0"/>
            </div>
            <fieldset>
                <Legend className="uppercase">Opacity</Legend>
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


        <CreateStippleModal ref={createStippleModalRef} createStipple={actions.STIPPLE.action}/>
        <CreatePathModal ref={createPathModalRef} createPath={actions.CREATE_PATH.action}/>
       
    </>
}

export default App
