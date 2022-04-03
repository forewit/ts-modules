import * as gestures from '../src/modules/gestures.js';
import * as keys from '../src/modules/keys.js';
import * as utils from '../src/utils.js';
console.log("hi");
// testing gestures
let testDiv = document.getElementsByClassName("test")[0];
gestures.track(testDiv);
testDiv.addEventListener("gesture", (e) => {
    let emoji = (e.detail.type === "mouse") ? "🖱️" : "👉";
    utils.log({ color: "yellow" }, `${emoji} ${e.detail.name}`);
});
utils.log({ color: "green", bold: true }, "👀 watching ", gestures.listAll());
// testing keys
// prevent reloading the page
keys.bind("Control+r, Control+R", (e) => {
    utils.log({ color: "red" }, "🔃 prevented page reload");
    e.preventDefault();
});
console.log("bye");
