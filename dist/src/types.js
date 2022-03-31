export function rotatePoint(point, pivot, radians) {
    const cos = Math.cos(radians), sin = Math.sin(radians);
    return {
        x: cos * (point.x - pivot.x) - sin * (point.y - pivot.y) + pivot.x,
        y: sin * (point.x - pivot.x) + cos * (point.y - pivot.y) + pivot.y
    };
}
export function pointInRectangle(point, rect) {
    const { origin, width, height, rotation } = rect;
    const rotatedPoint = rotatePoint(point, origin, -rotation);
    return rotatedPoint.x >= origin.x && rotatedPoint.x <= origin.x + width &&
        rotatedPoint.y >= origin.y && rotatedPoint.y <= origin.y + height;
}
