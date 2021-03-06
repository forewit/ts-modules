import * as gestures from '../src/gestures.js';
import * as keys from '../src/keys.js';
import * as utils from '../src/utils.js';


// testing gestures
let testDiv = document.getElementsByClassName("test")[0];
gestures.enable(testDiv);
testDiv.addEventListener("gesture", (e: CustomEvent) => {
    let emoji = (e.detail.type === "mouse") ? "🖱️" : "👉";
    utils.log(`${emoji} ${e.detail.name}`, {color: "grey"});
});

// testing keys
keys.bind("Control+r, Control+R", (e) => {
    utils.log("🔃 prevented page reload", {color: "lightred"});
    e.preventDefault();
});