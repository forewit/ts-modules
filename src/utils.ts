import { v4 as uuidv4 } from 'uuid';


export const generateUUID = () => {
    return uuidv4();
}

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
export const throttle = (fn: Function, wait: number, options?: { [name: string]: any }) => {
    options = options || {};
    let context: any,
        args: any,
        result: any,
        timeout: any,
        previous = 0;

    let later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = fn.apply(context, args);
    };

    return function () {
        let now = Date.now();
        if (!previous && options.leading === false) previous = now;
        let remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = fn.apply(context, args);
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    }
};

/**
 * Creates a psudo random unique identifier string
 * 
 * @returns {string} randomized unique ID
 */
export function generate_ID(): string {
    const dateString = Date.now().toString(36);
    const randomString = Math.random().toString(36).substring(2, 9);
    return `${dateString}-${randomString}`;
}

/**
 * Rotates a point (x, y) around a center point (cx, cy)
 * a number of radians (rad)
 */
export function rotatePoint(cx, cy, x, y, rad) {
    let cos = Math.cos(rad),
        sin = Math.sin(rad),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return { x: nx, y: ny };
}

export function pointInRectangle(x, y, rx, ry, rw, rh) {
    return x >= rx && x <= rx + rw &&
        y >= ry && y <= ry + rh;
}

// credit: https://yal.cc/rot-rect-vs-circle-intersection/
export function pointInRotatedRectangle(pointX, pointY,
    rectX, rectY, rectOffsetX, rectOffsetY, rectWidth, rectHeight, rectAngle
) {
    var relX = pointX - rectX;
    var relY = pointY - rectY;
    var angle = -rectAngle;
    var angleCos = Math.cos(angle);
    var angleSin = Math.sin(angle);
    var localX = angleCos * relX - angleSin * relY;
    var localY = angleSin * relX + angleCos * relY;
    return localX >= -rectOffsetX && localX <= rectWidth - rectOffsetX &&
        localY >= -rectOffsetY && localY <= rectHeight - rectOffsetY;
}