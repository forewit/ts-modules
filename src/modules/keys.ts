
interface Shortcut {
    keycodes: number[],
    handler: (e: KeyboardEvent) => void
}

let keybindings: { [keycodes: string]: Shortcut } = {},
    down_keys: { [keycode: number]: boolean } = {},
    listening = false;

export function listen(shortcuts: Shortcut[]): void {
    // resume listeners
    if (!listening)  {
        window.addEventListener('keydown', keydownHandler, {passive: false});
        window.addEventListener('keyup', keyupHandler);
        window.addEventListener('blur', blurHandler);
        listening = true;
    }

    // return if no shortcuts are specified
    if (!shortcuts) return;

    // add shortcuts to keybindings
    for (let shortcut of shortcuts) {
        let id = shortcut.keycodes.sort().join(',');
        keybindings[id] = shortcut;
    }
}
export function stop(keycodes?: number[]): void {
    // pause all if no keycodes are specified
    if (!keycodes) {
        window.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('keyup', keyupHandler);
        window.removeEventListener('blur', blurHandler);
        listening = false;
        return;
    }

    // remove specific keybindings
    for (let keycode of keycodes) {
        let id = keycodes.sort().join(',');
        delete keybindings[id];
    }

    // remove listeners if no keybindings are left
    if (Object.keys(keybindings).length === 0) stop();

}

function keydownHandler(e: KeyboardEvent): void {}
function keyupHandler(e: KeyboardEvent): void {}
function blurHandler(e: FocusEvent): void {}
