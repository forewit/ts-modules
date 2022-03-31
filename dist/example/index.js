import * as gestures from '../src/modules/gestures.js';
import * as utils from '../src/utils.js';
console.log("hi");
let testDiv = document.getElementsByClassName("test")[0];
gestures.track(testDiv);
testDiv.addEventListener("gesture", (e) => {
    utils.log({ color: "green", bold: true }, `👉 ${e.detail.name}`);
});
utils.log({ color: "green", bold: true }, "👀 watching ", gestures.listAll());
console.log("bye");
