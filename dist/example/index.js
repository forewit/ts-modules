import * as gestures from '../src/modules/gestures.js';
import * as keys from '../src/modules/keys.js';
import * as utils from '../src/utils.js';
console.log("hi");
// testing gestures
let testDiv = document.getElementsByClassName("test")[0];
gestures.track(testDiv);
testDiv.addEventListener("gesture", (e) => {
    let emoji = (e.detail.type === "mouse") ? "🖱️" : "👉";
    utils.log({ color: "green", bold: true }, `${emoji} ${e.detail.name}`);
});
utils.log({ color: "green", bold: true }, "👀 watching ", gestures.listAll());
// testing keys
keys.bind("ctrl+s, cmd+s", (e, shortcut) => { alert("saving"); });
console.log("bye");
