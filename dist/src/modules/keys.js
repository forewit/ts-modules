/*
keys.bind("ctrl+s, cmd+s", (e: KeyboardEvent, shortcut: string) => {});
keys.unbind("ctrl+s, cmd+s"); || keys.unbind();


NOTES
only need to track keydown event
can handle shortcuts and chords
"ctrl+s" (ctrl and s pressed at the same time)
"g t" (g pressed, then t pressed)
*/
const KEY_DELAY = 1000;
let keybindings = {}, down = {}, chord = [], listening = false;
function parseShortcut(shortcut) {
    return shortcut.split(/\s*,\s*/g);
}
function keydownHandler(e) { }
function keyupHandler(e) { down[e.key] = false; }
function blurHandler() { down = {}; }
export function bind(shortcut, fn) {
    // resume window event listeners
    if (!listening) {
        window.addEventListener('keydown', keydownHandler, { passive: false });
        window.addEventListener('keyup', keyupHandler);
        window.addEventListener('blur', blurHandler);
        listening = true;
    }
    // parse shortcut string
    // add shortcuts to keybindings
}
export function unbind(...shortcuts) {
    // pause all if no ids are specified
    if (shortcuts.length === 0) {
        window.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('keyup', keyupHandler);
        window.removeEventListener('blur', blurHandler);
        listening = false;
        return;
    }
    // remove specific keybindings
    for (let id of shortcuts)
        delete keybindings[id];
    // remove window event listeners if no keybindings are left
    if (Object.keys(keybindings).length === 0)
        unbind();
}
