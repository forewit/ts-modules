/* Module for using HTML5 drag and drop to swap CSS Grid items

Supported: Chromium, iOS Safari
Unsupported: Firefox, IE

Example HTML:
    <div class="grid">
        <div class="grid-item">1</div>
        <div class="grid-item">2</div>
        <div class="grid-item">3</div>
    </div>

Example CSS:
    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        grid-template-rows: repeat(2, 1fr);
        grid-gap: 1em;
    }
    .grid-item {
        background-color: #eee;
        border: 1px solid #ccc;
        padding: 1em;
    }

Example JavaScript:
    import { SwapGrid } from './swapgrid';
    const grid = document.querySelector('.grid');
    const swapGrid = new SwapGrid(grid);

Behaviour:
    - if a grid item is dropped on another grid item in the same grid, swap the two items and reflow the grid
    - do nothing if a grid item is dropped on a non-grid item
*/
let activeElms = [];
const dragstartHandler = (e) => {
    // logging
    console.log("dragstart", e.target);
};
const dragoverHandler = (e) => {
    // logging
    console.log("dragover", e.target);
};
const dropHandler = (e) => {
    // logging
    console.log("drop", e.target);
};
export function enable(...elms) {
    for (let elm of elms) {
        // skip if element is already tracked
        if (activeElms.findIndex(e => e === elm) !== -1)
            continue;
        // add window event listeners if this is the first element being tracked
        if (activeElms.length == 0) {
            // TODO: add window event listeners
        }
        // start tracking element
        activeElms.push(elm);
        // TODO: add element event listeners
    }
}
export function disable(...elms) {
    const clearEventListeners = (elm) => {
        // TODO: remove element event listeners
    };
    // if no elements were specified, disable all active elements
    if (elms.length == 0) {
        for (let elm of activeElms)
            clearEventListeners(elm);
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
        // TODO: remove window event listeners
    }
}
