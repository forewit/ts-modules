import * as gestures from '../src/gestures.js';
import * as keys from '../src/keys.js';
import * as utils from '../src/utils.js';
import Drawing from '../src/drawing.js';

// testing gestures
let gesturesElm = document.getElementById("gestures");
gestures.enable(gesturesElm);
gesturesElm.addEventListener("gesture", (e: CustomEvent) => {
    utils.log(`🖱️ ${e.detail.name}`, { color: "dodgerblue" });
});

// testing keys
keys.bind("Control+r, Control+R", (e) => {
    utils.log("⌨️ prevented page reload", { color: "goldenrod" });
    e.preventDefault();
});

// testing pen
let drawingCanvas = document.getElementById("drawing") as HTMLCanvasElement;
new Drawing(drawingCanvas);