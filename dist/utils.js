"use strict";
exports.__esModule = true;
exports.pointInRotatedRectangle = exports.pointInRectangle = exports.rotatePoint = exports.generate_ID = exports.throttle = exports.generateUUID = void 0;
var uuid_1 = require("uuid");
var generateUUID = function () {
    return (0, uuid_1.v4)();
};
exports.generateUUID = generateUUID;
// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
var throttle = function (fn, wait, options) {
    options = options || {};
    var context, args, result, timeout, previous = 0;
    var later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = fn.apply(context, args);
    };
    return function () {
        var now = Date.now();
        if (!previous && options.leading === false)
            previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = fn.apply(context, args);
        }
        else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};
exports.throttle = throttle;
/**
 * Creates a psudo random unique identifier string
 *
 * @returns {string} randomized unique ID
 */
function generate_ID() {
    var dateString = Date.now().toString(36);
    var randomString = Math.random().toString(36).substring(2, 9);
    return "".concat(dateString, "-").concat(randomString);
}
exports.generate_ID = generate_ID;
/**
 * Rotates a point (x, y) around a center point (cx, cy)
 * a number of radians (rad)
 */
function rotatePoint(cx, cy, x, y, rad) {
    var cos = Math.cos(rad), sin = Math.sin(rad), nx = (cos * (x - cx)) + (sin * (y - cy)) + cx, ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return { x: nx, y: ny };
}
exports.rotatePoint = rotatePoint;
function pointInRectangle(x, y, rx, ry, rw, rh) {
    return x >= rx && x <= rx + rw &&
        y >= ry && y <= ry + rh;
}
exports.pointInRectangle = pointInRectangle;
// credit: https://yal.cc/rot-rect-vs-circle-intersection/
function pointInRotatedRectangle(pointX, pointY, rectX, rectY, rectOffsetX, rectOffsetY, rectWidth, rectHeight, rectAngle) {
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
exports.pointInRotatedRectangle = pointInRotatedRectangle;
