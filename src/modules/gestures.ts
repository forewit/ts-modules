/**
 * MOUSE GESTURES -------------------
 * wheel     (see e.detail.event for wheel event details)
 * click
 * middle-click
 * right-click
 * double-click
 * longclick
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

 // generate unique id
const generateID = (): string => { return Math.random().toString(36).substring(2, 9) }

let trackedElms: {[id: string]: HTMLElement} = {};




export function track(elm: HTMLElement) {
    const id = generateID();
    trackedElms[id] = elm;
    return id;
}

export function untrack(id: string) {
    delete trackedElms[id];
}

export function untrackAll () {
    trackedElms = {};
}

/*
export track
untrack
untrackAll
logTrackedElms
*/