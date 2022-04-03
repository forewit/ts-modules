import * as gestures from '../src/modules/gestures.js';
import * as keys from '../src/modules/keys.js';
import * as utils from '../src/utils.js';


// testing gestures
let testDiv = document.getElementsByClassName("test")[0];
gestures.track(testDiv);
testDiv.addEventListener("gesture", (e: CustomEvent) => {
    let emoji = (e.detail.type === "mouse") ? "🖱️" : "👉";
    utils.log(`${emoji} ${e.detail.name}`, {color: "grey"});
});
utils.log("👀 watching ", gestures.getTrackedElms(), {color: "green", bold:true});


// testing keys
keys.bind("Control+r, Control+R", (e) => {
    utils.log("🔃 prevented page reload", {color: "red"});
    e.preventDefault();
});
utils.log("🔑 listening ", keys.getKeybindings(), {color:"green", bold:true});