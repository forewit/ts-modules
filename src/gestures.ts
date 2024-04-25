/**
 * MOUSE GESTURES -------------------
 * wheel     (see e.detail.event for wheel event details)
 * left-click
 * middle-click
 * right-click
 * double-click
 * longclick
 * longclick-release (only triggered if mouse did not move longclick)
 * 
 * left-click-drag-start
 * left-click-dragging
 * left-click-drag-end
 * 
 * middle-click-drag-start
 * middle-click-dragging
 * middle-click-drag-end
 * 
 * right-click-drag-start
 * right-click-dragging
 * right-click-drag-end
 * 
 * longclick-drag-start
 * longclick-dragging
 * longclick-drag-end
 * --------------------------------
 * 
 * TOUCH GESTURES -------------------
 * tap
 * doubletap
 * longpress
 * longpress-release
 * 
 * touch-drag-start
 * touch-dragging
 * touch-drag-end
 * 
 * longpress-drag-start
 * longpress-dragging
 * longpress-drag-end
 * 
 * pinch-start
 * pinching
 * pinch-end
 * --------------------------------
 */

const LONG_PRESS_DELAY = 500;
const DOUBLE_TAP_DELAY = 300; // reduce to 100 to remove double taps
const LONG_CLICK_DELAY = 500;
const DOUBLE_CLICK_DELAY = 300; // reduce to 100 to remove double clicks

// MousePointer Class
class MousePointer {
    isMoving: boolean = false;
    isLongclick: boolean = false;
    button: number = 0;
    lastX: number = 0;
    lastY: number = 0;
    consecutiveClicks: number = 0;
    lastMouseupTime: number = 0;
    activeElement: HTMLElement | null = null;
    constructor() { this.reset() }
    reset() {
        this.isMoving = false;
        this.isLongclick = false;
        this.button = 0;
        this.lastX = 0;
        this.lastY = 0;
        this.consecutiveClicks = 0;
        this.lastMouseupTime = 0;
        this.activeElement = null;
    }
}

// TouchPointer Class
class TouchPointer {
    isDragging = false;
    isPinching = false;
    isLongpressed = false;
    consecutiveTaps = 0;
    lastTouchendTime = 0;
    lastCenterX = 0;
    lastCenterY = 0;
    identifier = 0;
    force = 1;
    x = 0;
    y = 0;
    hypotenuse: number | null = 0;
    activeElement: HTMLElement | null = null;
    constructor() { this.reset() }
    reset() {
        this.isDragging = false;
        this.isPinching = false;
        this.isLongpressed = false;
        this.consecutiveTaps = 0;
        this.lastTouchendTime = 0;
        this.lastCenterX = 0;
        this.lastCenterY = 0;
        this.identifier = 0;
        this.force = 1;
        this.x = 0;
        this.y = 0;
        this.hypotenuse = 0; // distance between two fingers
        this.activeElement = null;
    }
}


interface Gesture {
    name: string,
    x: number,
    y: number,
    event?: Event,
    dx?: number,
    dy?: number,
    zoom?: number,
    force?: number
}

let activeElms: HTMLElement[] = [],
    mouse = new MousePointer(),
    touch = new TouchPointer();

const dispatchGesture = (elm: HTMLElement | null, data: Gesture) => {
    if (elm == null) return;
    elm.dispatchEvent(new CustomEvent("gesture", {
        detail: data,
        bubbles: false,
        cancelable: false
    }))
}

const focusHandler = (e: Event) => {
    // reset mouse and touch
    mouse.reset();
    touch.reset();

    mouse.lastMouseupTime = Date.now();

    // remove all window listeners
    window.removeEventListener("mousemove", mousemoveHandler);
    window.removeEventListener("mouseup", mouseupHandler);
    window.removeEventListener("touchmove", touchmoveHandler);
    window.removeEventListener("touchend", touchendHandler);
}

const blurHandler = (e: Event) => {
    // remove all window listeners
    window.removeEventListener("mousemove", mousemoveHandler);
    window.removeEventListener("mouseup", mouseupHandler);
    window.removeEventListener("touchmove", touchmoveHandler);
    window.removeEventListener("touchend", touchendHandler);

    // mouse-drag-end detection
    if (mouse.isMoving) {
        mouse.isMoving = false;
        if (mouse.isLongclick) {
            mouse.isLongclick = false;
            dispatchGesture(mouse.activeElement, { name: "longclick-drag-end", x: mouse.lastX, y: mouse.lastY });
        } else {
            switch (mouse.button) {
                case 0:
                    dispatchGesture(mouse.activeElement, { name: "left-click-drag-end", x: mouse.lastX, y: mouse.lastY });
                    break;
                case 1:
                    dispatchGesture(mouse.activeElement, { name: "middle-click-drag-end", x: mouse.lastX, y: mouse.lastY });
                    break;
                case 2:
                    dispatchGesture(mouse.activeElement, { name: "right-click-drag-end", x: mouse.lastX, y: mouse.lastY });
                    break;
            }
        }
    }

    // longclick-release
    if (mouse.isLongclick) dispatchGesture(mouse.activeElement, { name: "longclick-release", x: mouse.lastX, y: mouse.lastY });

    // reset mouse
    mouse.reset();


    // touch-drag-end detection
    if (touch.isDragging) {
        touch.isDragging = false;
        if (touch.isLongpressed) {
            touch.isLongpressed = false;
            dispatchGesture(touch.activeElement, { name: "longpress-drag-end", x: touch.lastCenterX, y: touch.lastCenterY });
        } else {
            dispatchGesture(touch.activeElement, { name: "touch-drag-end", x: touch.lastCenterX, y: touch.lastCenterY });
        }
    }

    // longpress-release
    if (touch.isLongpressed) dispatchGesture(touch.activeElement, { name: "longpress-release", x: touch.lastCenterX, y: touch.lastCenterY });

    // reset touch
    touch.reset();
}

const wheelHandler = (e: WheelEvent) => {
    dispatchGesture(e.target as HTMLElement, { name: "wheel", x: e.clientX, y: e.clientY, event: e });

    // prevent page scrolling
    e.preventDefault();
    e.stopPropagation();
}

const contextmenuHandler = (e: Event) => {
    // right-clicks are handled by the mouseup handler
    e.preventDefault();
    e.stopPropagation();
}

const mousedownHandler = (e: MouseEvent) => {
    // return if the event is on an active element
    if (document.activeElement === e.target) return;

    // add mousemove and mouseup listeners
    window.addEventListener("mousemove", mousemoveHandler);
    window.addEventListener("mouseup", mouseupHandler);

    // set mouse
    mouse.activeElement = e.target as HTMLElement;
    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;
    if (!mouse.isMoving) mouse.button = e.button;

    // longclick detection
    if (mouse.button === 0) {
        window.setTimeout(() => {
            if (Date.now() - mouse.lastMouseupTime >= LONG_CLICK_DELAY && !mouse.isMoving) {
                // uncomment this to trigger clicks after long clicks
                //window.removeEventListener("mousemove", mousemoveHandler);
                //window.removeEventListener("mouseup", mouseupHandler);
                //-----------------------------------------------------

                mouse.isLongclick = true;
                dispatchGesture(mouse.activeElement, { name: "longclick", x: e.clientX, y: e.clientY });
            }
        }, LONG_CLICK_DELAY)
    }

    // prevent default
    e.preventDefault();
    e.stopPropagation();
}

const mousemoveHandler = (e: MouseEvent) => {
    // return if there is no movement
    if (e.movementX === 0 && e.movementY === 0) return;

    // e.movementX and e.movementY do not seem to be accurate 
    let dx = e.clientX - mouse.lastX,
        dy = e.clientY - mouse.lastY;

    // mouse-drag-start detection
    if (!mouse.isMoving) {
        if (mouse.isLongclick) {
            dispatchGesture(mouse.activeElement, { name: "longclick-drag-start", x: e.clientX, y: e.clientY });
        } else {
            switch (mouse.button) {
                case 0:
                    dispatchGesture(mouse.activeElement, { name: "left-click-drag-start", x: e.clientX, y: e.clientY });
                    break;
                case 1:
                    dispatchGesture(mouse.activeElement, { name: "middle-click-drag-start", x: e.clientX, y: e.clientY });
                    break;
                case 2:
                    dispatchGesture(mouse.activeElement, { name: "right-click-drag-start", x: e.clientX, y: e.clientY });
                    break;
            }
        }
    }

    // set mouse
    mouse.isMoving = true;
    mouse.lastX = e.clientX;
    mouse.lastY = e.clientY;

    // mouse-dragging detection
    if (mouse.isLongclick) {
        dispatchGesture(mouse.activeElement, { name: "longclick-dragging", x: e.clientX, y: e.clientY, dx: dx, dy: dy });
    } else {
        switch (mouse.button) {
            case 0:
                dispatchGesture(mouse.activeElement, { name: "left-click-dragging", x: e.clientX, y: e.clientY, dx: dx, dy: dy });
                break;
            case 1:
                dispatchGesture(mouse.activeElement, { name: "middle-click-dragging", x: e.clientX, y: e.clientY, dx: dx, dy: dy });
                break;
            case 2:
                dispatchGesture(mouse.activeElement, { name: "right-click-dragging", x: e.clientX, y: e.clientY, dx: dx, dy: dy });
                break;
        }
    }
}

const mouseupHandler = (e: MouseEvent) => {
    // remove mousemove and mouseup listeners
    window.removeEventListener("mousemove", mousemoveHandler);
    window.removeEventListener("mouseup", mouseupHandler);

    // set mouse
    mouse.lastMouseupTime = Date.now();

    // mouse-drag-end detection
    if (mouse.isMoving) {
        mouse.isMoving = false;
        if (mouse.isLongclick) {
            mouse.isLongclick = false;
            dispatchGesture(mouse.activeElement, { name: "longclick-drag-end", x: mouse.lastX, y: mouse.lastY });
        } else {
            switch (mouse.button) {
                case 0:
                    dispatchGesture(mouse.activeElement, { name: "left-click-drag-end", x: mouse.lastX, y: mouse.lastY });
                    break;
                case 1:
                    dispatchGesture(mouse.activeElement, { name: "middle-click-drag-end", x: mouse.lastX, y: mouse.lastY });
                    break;
                case 2:
                    dispatchGesture(mouse.activeElement, { name: "right-click-drag-end", x: mouse.lastX, y: mouse.lastY });
                    break;
            }
        }
    } else if (!mouse.isLongclick) {
        // right-click detection
        if (e.button === 2) {
            dispatchGesture(mouse.activeElement, { name: "right-click", x: e.clientX, y: e.clientY });
        } else if (e.button === 1) {
            dispatchGesture(mouse.activeElement, { name: "middle-click", x: e.clientX, y: e.clientY });
        } else {
            // left-click detection
            if (mouse.consecutiveClicks === 0) {
                dispatchGesture(mouse.activeElement, { name: "left-click", x: e.clientX, y: e.clientY });
            }

            // double-click detection
            mouse.consecutiveClicks++;
            window.setTimeout(() => {
                if (mouse.consecutiveClicks > 1) {
                    dispatchGesture(mouse.activeElement, { name: "double-click", x: e.clientX, y: e.clientY });
                }
                mouse.consecutiveClicks = 0;
            }, DOUBLE_CLICK_DELAY);
        }
    }

    // longclick-release
    if (mouse.isLongclick) dispatchGesture(mouse.activeElement, { name: "longclick-release", x: e.clientX, y: e.clientY });
    mouse.isLongclick = false;
}

const touchstartHandler = (e: TouchEvent) => {
    // prevent pinch-zoom
    if (e.touches.length > 1) {
        e.preventDefault();
        e.stopPropagation();
    }

    // return if touch is not on active element
    if (document.activeElement === e.target) return;

    // prevent default
    e.preventDefault();
    e.stopPropagation();

    // don't handle multiple touches at once
    if (e.touches.length > 1) {
        if (e.touches[0].identifier === touch.identifier) return;
        touch.isPinching = true;
    }

    // add event listeners
    window.addEventListener("touchmove", touchmoveHandler, { passive: false });
    window.addEventListener("touchend", touchendHandler);
    window.addEventListener("touchcancel", touchendHandler);

    // set touch
    touch.identifier = e.touches[0].identifier;
    touch.x = e.touches[0].clientX;
    touch.y = e.touches[0].clientY;
    touch.activeElement = e.target as HTMLElement;

    // longpress detection
    window.setTimeout(() => {
        // cancel longpress if in the middle of a gesture
        if (touch.isPinching || touch.isDragging) return;

        // verify longpress hasn't been released
        if (Date.now() - touch.lastTouchendTime >= LONG_PRESS_DELAY) {
            // update touch
            touch.isDragging = false;
            touch.isPinching = false;
            touch.hypotenuse = null;
            touch.isLongpressed = true;

            dispatchGesture(touch.activeElement, { name: "longpress", x: touch.x, y: touch.y });
        }
    }, LONG_PRESS_DELAY);
}

const touchmoveHandler = (evt: TouchEvent) => {
    evt.preventDefault();
    evt.stopPropagation();

    if (touch.isDragging) {
        // capture previous position
        let lastX = touch.x,
            lastY = touch.y;

        // update touch
        touch.x = evt.touches[0].clientX;
        touch.y = evt.touches[0].clientY;
        //touch.identifier = e.touches[0].identifier;

        // calculate distance
        let dx = touch.x - lastX,
            dy = touch.y - lastY;

        // touch-dragging detection
        if (touch.isLongpressed) {
            dispatchGesture(touch.activeElement, { name: "longpress-dragging", x: touch.x, y: touch.y, dx: dx, dy: dy, force: evt.touches[0].force });
        } else {
            dispatchGesture(touch.activeElement, { name: "touch-dragging", x: touch.x, y: touch.y, dx: dx, dy: dy, force: evt.touches[0].force });
        }
        return;
    } else if (!touch.isLongpressed && (touch.isPinching || evt.touches.length > 1)) {
        // update touch
        touch.x = evt.touches[0].clientX;
        touch.y = evt.touches[0].clientY;
        //touch.identifier = e.touches[0].identifier;

        // capture 2nd touch
        let touch2 = {
            x: evt.touches[1].clientX,
            y: evt.touches[1].clientY,
        }

        // capture center of 2 touches
        let center = {
            x: (touch.x + touch2.x) / 2,
            y: (touch.y + touch2.y) / 2,
        }

        // pinch-start detection
        let hypo1 = Math.hypot((touch.x - touch2.x), (touch.y - touch2.y));
        if (touch.hypotenuse === null) {
            touch.hypotenuse = hypo1;
            touch.lastCenterX = center.x;
            touch.lastCenterY = center.y;
            dispatchGesture(touch.activeElement, { name: "pinch-start", x: center.x, y: center.y });
        }

        // pinching detection
        touch.isPinching = true;
        let zoom = hypo1 / touch.hypotenuse;
        let dx = center.x - touch.lastCenterX,
            dy = center.y - touch.lastCenterY;
        dispatchGesture(touch.activeElement, { name: "pinching", x: center.x, y: center.y, zoom: zoom, dx: dx, dy: dy });
        touch.hypotenuse = hypo1;
        touch.lastCenterX = center.x;
        touch.lastCenterY = center.y;
        return;
    } else {
        // longpress-dragging detection
        touch.isDragging = true;
        if (touch.isLongpressed) {
            dispatchGesture(touch.activeElement, { name: "longpress-drag-start", x: touch.x, y: touch.y, force: evt.touches[0].force });

            // update touch
            touch.x = evt.touches[0].clientX;
            touch.y = evt.touches[0].clientY;
            //touch.identifier = e.touches[0].identifier;

            dispatchGesture(touch.activeElement, { name: "longpress-dragging", x: touch.x, y: touch.y, dx: 0, dy: 0, force: evt.touches[0].force });
        } else {
            dispatchGesture(touch.activeElement, { name: "touch-drag-start", x: touch.x, y: touch.y, force: evt.touches[0].force });

            // update touch
            touch.x = evt.touches[0].clientX;
            touch.y = evt.touches[0].clientY;
            //touch.identifier = e.touches[0].identifier;

            dispatchGesture(touch.activeElement, { name: "touch-dragging", x: touch.x, y: touch.y, dx: 0, dy: 0, force: evt.touches[0].force });
        }
    }
}

const touchendHandler = (evt: TouchEvent) => {
    if (touch.isDragging && evt.touches.length > 0 && evt.touches[0].identifier === touch.identifier) {
        return;
    }

    touch.lastTouchendTime = Date.now();

    // remove event listeners
    window.removeEventListener("touchmove", touchmoveHandler);
    window.removeEventListener("touchend", touchendHandler);
    window.removeEventListener("touchcancel", touchendHandler);

    // touch-drag-end detection
    if (touch.isDragging) {
        touch.isDragging = false;
        if (touch.isLongpressed) {
            touch.isLongpressed = false;
            dispatchGesture(touch.activeElement, { name: "longpress-drag-end", x: touch.x, y: touch.y });
        } else {
            dispatchGesture(touch.activeElement, { name: "touch-drag-end", x: touch.x, y: touch.y });
        }
    } else if (touch.isPinching) {
        touch.isPinching = false;
        touch.hypotenuse = null;
        dispatchGesture(touch.activeElement, { name: "pinch-end", x: touch.lastCenterX, y: touch.lastCenterY });
    } else if (!touch.isLongpressed) {
        // tap detection
        if (touch.consecutiveTaps === 0) dispatchGesture(touch.activeElement, { name: "tap", x: touch.x, y: touch.y });

        // double-tap detection
        touch.consecutiveTaps++;
        window.setTimeout(() => {
            if (touch.consecutiveTaps > 1) dispatchGesture(touch.activeElement, { name: "double-tap", x: touch.x, y: touch.y });
            touch.consecutiveTaps = 0;
        }, DOUBLE_TAP_DELAY);
    }

    // longpress-release
    if (touch.isLongpressed) dispatchGesture(touch.activeElement, { name: "longpress-release", x: touch.x, y: touch.y });
    touch.isLongpressed = false;
}

export function enable(...elms: HTMLElement[]): void {
    for (let elm of elms) {
        // skip if element is already tracked
        if (activeElms.findIndex(e => e === elm) !== -1) continue;

        // add window event listeners if this is the first element being tracked
        if (activeElms.length == 0) {
            window.addEventListener('blur', blurHandler);
            window.addEventListener('focus', focusHandler);
        }

        // start tracking element
        activeElms.push(elm);
        elm.addEventListener('touchstart', touchstartHandler, { passive: false });
        elm.addEventListener('mousedown', mousedownHandler, { passive: false });
        elm.addEventListener('contextmenu', contextmenuHandler, { passive: false });
        elm.addEventListener('wheel', wheelHandler, { passive: false });
    }
}

export function disable(...elms: HTMLElement[]): void {
    const clearEventListeners = (elm: HTMLElement): void => {
        elm.removeEventListener('touchstart', touchstartHandler);
        elm.removeEventListener('mousedown', mousedownHandler);
        elm.removeEventListener('contextmenu', contextmenuHandler);
        elm.removeEventListener('wheel', wheelHandler);
    }

    // if no elements were specified, disable all active elements
    if (elms.length == 0) {
        for (let elm of activeElms) clearEventListeners(elm);
        activeElms = [];
    }
    // otherwise, disable specified elements
    else {
        for (let elm of elms) {
            let index = activeElms.findIndex(e => e === elm);
            if (index !== -1) {
                clearEventListeners(elm);
                activeElms.splice(index, 1);
            }
        }
    }

    // if no more elements are enabled, remove window event listeners
    if (activeElms.length == 0) {
        window.removeEventListener('blur', blurHandler);
        window.removeEventListener('focus', focusHandler);
    }
}