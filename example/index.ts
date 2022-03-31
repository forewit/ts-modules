import * as Gestures from '../src/modules/gestures.js';

console.log("hi");



let testDiv = document.getElementsByClassName("test")[0];
Gestures.track(testDiv);
testDiv.addEventListener("gesture", function(e: CustomEvent) {
    console.log(e.detail);
});
Gestures.listAll();

console.log("bye");