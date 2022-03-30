export interface Point {
    x: number;
    y: number;
}

/* Global coordinate system:
           -y
            |    -z (in)
            |   /
            | /
  -x - - - - - - - - +x
           /|
         /  |
(out) +z    |
           +y
*/
export interface Rect {
    origin: Point; // top left
    width: number;
    height: number;
    rotation: number; // radians
}

export function rotatePoint (point: Point, pivot: Point, radians: number): Point {
    const cos = Math.cos(radians),
        sin = Math.sin(radians);

    return {
        x: cos * (point.x - pivot.x) - sin * (point.y - pivot.y) + pivot.x,
        y: sin * (point.x - pivot.x) + cos * (point.y - pivot.y) + pivot.y
    };  
}

export function pointInRectangle (point: Point, rect: Rect): boolean {
    const { origin, width, height, rotation } = rect;
    const rotatedPoint = rotatePoint(point, origin, -rotation);
    return rotatedPoint.x >= origin.x && rotatedPoint.x <= origin.x + width &&
        rotatedPoint.y >= origin.y && rotatedPoint.y <= origin.y + height;
}