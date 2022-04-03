
/*
keys.bind("ctrl+s, cmd+s", (e: KeyboardEvent, shortcut: string) => {});
keys.unbind("ctrl+s, cmd+s"); || keys.unbind();


NOTES
only need to track keydown event
can handle shortcuts and chords
"ctrl+s" (ctrl and s pressed at the same time)
"g t" (g pressed, then t pressed)
*/


const SHORTCUT_SEPARATOR = ", ";
const SPLIT_KEY = "+";

// Example: "Control+keyK+keyO, Shift+keyO, Control+keyS"
// 
// keybindings = [{
// "keyO": [{ down: ["Control", "keyK"], callback: fn },
//          { down: ["Shift"], callback: fn }],
// "keyS": [{ down: ["Control"], callback: fn }]
// }]
interface Keybinding {
    [key: string]: { down: string[], callback: (e: KeyboardEvent) => any}[]
};

let keybindings: Keybinding = {},
    down: { [keycode: number]: boolean } = {},
    listening = false;

export function bind(shortcuts: string, fn: (e: KeyboardEvent) => any): void {
    // resume window event listeners
    if (!listening) {
        window.addEventListener('keydown', keydownHandler, { passive: false });
        window.addEventListener('keyup', keyupHandler);
        window.addEventListener('blur', blurHandler);
        listening = true;
    }

    // split shortcut string into array of shortcuts
    let splitShortcuts: string[] = shortcuts.split(SHORTCUT_SEPARATOR);
    
    // create a keybinding for each shortcut
    splitShortcuts.forEach(s => {
        let keys: string[] = s.split(SPLIT_KEY);
        let id = keys.pop();

        if (!keybindings[id]) keybindings[id] = [];
        keybindings[id].push({ down: keys, callback: fn });
    });
}

export function unbind(shortcuts?: String): void {
    // unbind all if no ids are specified
    if (!shortcuts) {
        window.removeEventListener('keydown', keydownHandler);
        window.removeEventListener('keyup', keyupHandler);
        window.removeEventListener('blur', blurHandler);
        listening = false;
        keybindings = {};
        return;
    }

    // split shortcut string into array of shortcuts
    let splitShortcuts: string[] = shortcuts.split(SHORTCUT_SEPARATOR);
    
    // remove keybindings for each shortcut
    splitShortcuts.forEach(s => {
        let keys: string[] = s.split(SPLIT_KEY);
        let id = keys.pop();

        keybindings[id].forEach(k => {
            // if keys matches the keybinding, remove it
            if (k.down.length === keys.length && k.down.every((k, i) => k === keys[i])) {
                delete keybindings[id];
            }
        });
    });
}

export function logKeybindings(): void { console.log(keybindings); }

function keydownHandler(e: KeyboardEvent): void {
    // return if composing
    if (e.isComposing) return;

    // update down keys
    down[e.key] = true;

    // check if key is in keybindings
    if (!keybindings[e.key]) return;

    // loop through each keybinding
    keybindings[e.key].forEach(k => {
        // if every and only the keys are down, call the callback
        // To force shortcuts to be exact, add:
        //      && Object.keys(down).length === (k.down.length+1)
        if (k.down.every(key => down[key])) {
            k.callback(e);
            console.log(down);
        }
    });
}
function keyupHandler(e: KeyboardEvent): void { delete down[e.key]; }
function blurHandler(): void { down = {}; }