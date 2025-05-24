import { useRef } from "react";
import { loadImage } from "./index"

function App() {
    const canvasRef = useRef();

    function uploadImage(file) {
        const blobURL = URL.createObjectURL(file);
        loadImage(blobURL, canvasRef.current);
    }
    return <>
        <h1>Threadgeist</h1>
        <label className="relative">
            <button className="px-4 border-2">Upload image</button>
            <input type="file" accept="image/*" multiple={false} className="opacity-0 cursor-pointer absolute inset-0 w-full h-full bg-sky-300" onChange={(e) => uploadImage(e.target.files[0])}/>
        </label>
        <canvas ref={canvasRef} />
    </>
}

export default App
