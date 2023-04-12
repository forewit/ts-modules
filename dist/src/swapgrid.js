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
export function enable(...elms) {
    // skip if element is already tracked
    // add window event listeners if this is the first element being tracked
    // start tracking element
}
export function disable(...elms) {
    // if no elements were specified, disable all active elements
    // otherwise, disable specified elements
    // if no more elements are enabled, remove any window event listeners
}
