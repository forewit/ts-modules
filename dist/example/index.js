import * as gestures from '../src/gestures.js';
import * as keys from '../src/keys.js';
import * as utils from '../src/utils.js';
import * as swapgrid from '../src/swapgrid.js';
// testing gestures
let testElm = document.getElementsByClassName("gestures")[0];
gestures.enable(testElm);
testElm.addEventListener("gesture", (e) => {
    utils.log(`🖱️ ${e.detail.name}`, { color: "dodgerblue" });
});
// testing keys
keys.bind("Control+r, Control+R", (e) => {
    utils.log("⌨️ prevented page reload", { color: "goldenrod" });
    e.preventDefault();
});
// testing swapgrid
let gridElm = document.getElementsByClassName("swapgrid")[0];
swapgrid.enable(gridElm);
