# Gestures.js
A simple library for detecting gestures on touch screens.

## importing the library
```js
import * as Gestures from "./gestures.js";
```

## enabling gestures
```js
Gestures.enable(document.body);
```

## disabling gestures
```js
Gestures.disable(document.body);
```

## listening for gestures
```js
document.body.addEventListener("gesture", (e) => {
    console.log(e.detail);
});
```

## gesture types
* tap
    * { name: "tap", x: 100, y: 100 }
* double-tap
    * { name: "double-tap", x: 100, y: 100 }
* longpress
    * { name: "longpress", x: 100, y: 100 }
* longpress-drag-start
    * { name: "longpress-drag-start", x: 100, y: 100 }
* longpress-dragging
    * { name: "longpress-dragging", x: 100, y: 100, dx: 0, dy: 0 }
* longpress-drag-end
    * { name: "longpress-drag-end", x: 100, y: 100 }
* longpress-release
    * { name: "longpress-release", x: 100, y: 100 }
* touch-drag-start
    * { name: "touch-drag-start", x: 100, y: 100 }
* touch-dragging
    * { name: "touch-dragging", x: 100, y: 100, dx: 0, dy: 0 }
* touch-drag-end
    * { name: "touch-drag-end", x: 100, y: 100 }
* pinch-start
    * { name: "pinch-start", x: 100, y: 100 }
* pinch-start
    * { name: "pinch-start", x: 100, y: 100 }
* pinch
    * { name: "pinch", x: 100, y: 100, zoom: 1.5, dx: 0, dy: 0 }
* pinch-end
    * { name: "pinch-end", x: 100, y: 100 }
* wheel
    * { name: "wheel", x: 100, y: 100, dx: 0, dy: 0 }

