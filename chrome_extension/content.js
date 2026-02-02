window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "TACTILE_TABLETOP_UPDATE") {
    chrome.storage.local.set({ "tactile_tabletop_mode_active": event.data.isActive });
  }
});

console.log("Tactile Tabletop: Content Script Injected.");

// A unique ID to match the one used in your OBR Extension metadata/storage
const STORAGE_KEY = "tactile_tabletop_mode_active";

// Create the transparent canvas overlay
const canvas = document.createElement('canvas');
canvas.id = 'tactile-tabletop-shield';
Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '2147483647',
    backgroundColor: 'transparent',
    pointerEvents: 'none' // Default to none (inactive)
});

document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

/**
 * The "Shield" Controller
 * This toggles whether the canvas intercepts touches or lets them through to OBR.
 */
function setShieldState(active) {
    if (active) {
        canvas.style.pointerEvents = 'all';
        canvas.style.cursor = 'crosshair';
        console.log("Tactile Tabletop: SHIELD ACTIVE. OBR inputs blocked.");
    } else {
        canvas.style.pointerEvents = 'none';
        canvas.style.cursor = 'default';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        console.log("Tactile Tabletop: SHIELD INACTIVE. OBR inputs allowed.");
    }
}

/**
 * Storage Listener
 * We check Chrome's local storage to see if the OBR Extension has 
 * flagged THIS specific browser instance as the Tabletop.
 */
chrome.storage.local.get([STORAGE_KEY], (result) => {
    setShieldState(result[STORAGE_KEY] === true);
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes[STORAGE_KEY]) {
        setShieldState(changes[STORAGE_KEY].newValue === true);
    }
});

/**
 * IR Frame Event Capture
 * When the shield is active (pointerEvents = 'all'), this listener 
 * catches EVERYTHING. OBR stays perfectly still.
 */
canvas.addEventListener('pointermove', (e) => {
    // Only draw/process if the canvas is in 'all' mode
    if (canvas.style.pointerEvents === 'all') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Visualize the raw touch point
        ctx.beginPath();
        ctx.arc(e.clientX, e.clientY, 25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 144, 226, 0.5)';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // FUTURE: This is where we will calculate clusters for miniatures
        // and send 'window.postMessage' to the OBR extension to move tokens.
    }
});

// Block context menu to prevent OBR from opening menus on long-press
canvas.addEventListener('contextmenu', (e) => {
    if (canvas.style.pointerEvents === 'all') e.preventDefault();
});

