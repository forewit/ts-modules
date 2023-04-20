import * as gestures from '../src/gestures.js';
import * as keys from '../src/keys.js';
import * as utils from '../src/utils.js';

// testing gestures
let testElm = document.getElementsByClassName("gestures")[0];
gestures.enable(testElm);
testElm.addEventListener("gesture", (e: CustomEvent) => {
    utils.log(`🖱️ ${e.detail.name}`, {color: "dodgerblue"});
});

// testing keys
keys.bind("Control+r, Control+R", (e) => {
    utils.log("⌨️ prevented page reload", {color: "goldenrod"});
    e.preventDefault();
});