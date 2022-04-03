
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

// Example: "Control+keyK+keyO, Shift+keyO"
// "keyO": [{ down: ["Control", "keyK"], callback: fn },
//          { down: ["Shift"], callback: fn }]
interface Keybinding {
    [key: string]: { down: string[], callback: Function }[]
};


let keybindings: Keybinding = {},
    down: { [keycode: number]: boolean } = {},
    chord: string[] = [],
    listening = false;

export function bind(shortcuts: string, fn: Function): void {
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

function keydownHandler(e: KeyboardEvent): void {}
function keyupHandler(e: KeyboardEvent): void { down[e.key] = false; }
function blurHandler(): void { down = {}; }

