// import gestures
import * as gestures from './gestures.js';
let dist = function (x1, y1, x2, y2) {
    var a = x2 - x1;
    var b = y2 - y1;
    return Math.sqrt(a * a + b * b);
};
export default class Drawing {
    constructor(element, options) {
        this.resizeObserver = new ResizeObserver(this.resize.bind(this));
        var me = this;
        if (!options)
            options = {};
        // Attributes
        me.lastPoint = { x: 0, y: 0 };
        me.height = 0;
        me.width = 0;
        me.dpi = window.devicePixelRatio;
        me.elm = element;
        me.ctx = me.elm.getContext("2d");
        me.drawRadius = (options.drawRadius) ? options.drawRadius : 10;
        me.lineWidth = (options.lineWidth) ? options.lineWidth : 5;
        me.lineCap = (options.lineCap) ? options.lineCap : "round";
        me.strokeStyle = (options.strokeStyle) ? options.strokeStyle : "#000000";
        me.lineDash = (options.lineDash) ? options.lineDash : [];
        // bind handlers
        me.dragHandler = me.dragHandle.bind(me);
        me.startHandler = me.startHandle.bind(me);
        me.resizeObserver.observe(me.elm);
        // initialize gestures
        gestures.enable(me.elm);
        me.elm.addEventListener('gesture', (e) => {
            switch (e.detail.name) {
                case 'left-click-drag-start':
                case 'touch-drag-start':
                    me.startHandle(e.detail.x, e.detail.y);
                    break;
                case 'left-click-dragging':
                case 'touch-dragging':
                    me.dragHandle(e.detail.x, e.detail.y);
                    break;
                default:
                    break;
            }
        });
        me.resize();
    }
    screenToCanvas(x, y) {
        // adjust for DPI & offset
        let rect = this.elm.getBoundingClientRect();
        return {
            x: (x + rect.left) * this.dpi,
            y: (y - rect.top) * this.dpi
        };
    }
    startHandle(x, y) {
        var me = this;
        // clear context
        me.ctx.resetTransform();
        me.ctx.clearRect(0, 0, me.width, me.height);
        // set path properties
        me.ctx.lineWidth = me.lineWidth;
        me.ctx.lineCap = me.lineCap;
        me.ctx.strokeStyle = me.strokeStyle;
        me.ctx.setLineDash(me.lineDash);
        // start path
        me.ctx.beginPath();
        me.lastPoint = me.screenToCanvas(x, y);
        me.ctx.moveTo(me.lastPoint.x, me.lastPoint.y);
    }
    dragHandle(x, y) {
        var me = this;
        let newPoint = me.screenToCanvas(x, y);
        // if using a drawing circle
        if (me.drawRadius > 0) {
            // do nothing if point is inside the drawing circle
            if (dist(newPoint.x, newPoint.y, me.lastPoint.x, me.lastPoint.y) <= me.drawRadius)
                return;
            // draw if the point is outside the drawing circle
            // see: https://math.stackexchange.com/questions/127613/closest-point-on-circle-edge-from-point-outside-inside-the-circle
            // A = point
            // B = lastPoint
            // r = drawRadius
            let denominator = Math.sqrt(newPoint.x * newPoint.x + newPoint.y * newPoint.y - 2 * newPoint.x * me.lastPoint.x + me.lastPoint.x * me.lastPoint.x - 2 * newPoint.y * me.lastPoint.y + me.lastPoint.y * me.lastPoint.y);
            let temp = {
                x: newPoint.x + me.drawRadius * ((me.lastPoint.x - newPoint.x) / denominator),
                y: newPoint.y + me.drawRadius * ((me.lastPoint.y - newPoint.y) / denominator)
            };
            newPoint = temp;
            // prevent jagged lines by making sure new points aren't too close together
            if (dist(me.lastPoint.x, me.lastPoint.y, newPoint.x, newPoint.y) <= 0.1)
                return;
        }
        // curve to the new point
        var xc = (me.lastPoint.x + newPoint.x) / 2;
        var yc = (me.lastPoint.y + newPoint.y) / 2;
        me.ctx.quadraticCurveTo(me.lastPoint.x, me.lastPoint.y, xc, yc);
        me.lastPoint = newPoint;
        me.ctx.stroke();
    }
    resize() {
        var me = this;
        console.log("resizing");
        me.ctx.resetTransform();
        //get DPI
        me.dpi = window.devicePixelRatio;
        //get CSS height
        //the + prefix casts it to an integer
        //the slice method gets rid of "px"
        let style_height = +getComputedStyle(me.elm).getPropertyValue("height").slice(0, -2);
        //get CSS width
        let style_width = +getComputedStyle(me.elm).getPropertyValue("width").slice(0, -2);
        // calculate new height & width
        me.height = style_height * me.dpi;
        me.width = style_width * me.dpi;
        //scale the canvas
        me.elm.setAttribute('height', me.height.toString());
        me.elm.setAttribute('width', me.width.toString());
    }
}
