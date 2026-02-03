/**
 * content.js
 * This script runs on owlbear.app and listens for messages 
 * emitted by the OBR Iframe (Tactile Tabletop Extension).
 */

console.log("Tactile Tabletop Bridge: Content script loaded.");

window.addEventListener("message", (event) => {
    // Security check: Ensure message comes from the same window/origin
    // and matches our specific source tag.
    if (event.data && event.data.source === "TACTILE_TABLETOP_OBR") {
        const { action, data, timestamp } = event.data;

        console.log(`%c[Tactile Bridge] Received: ${action}`, "color: #3b82f6; font-weight: bold;");
        console.table(data);

        if (action === "TACTILE_TOGGLE") {
            handleToggle(data.enabled);
        }
    }
});

/**
 * Logic to handle the toggle state.
 * Currently just logs, but will later control the transparent overlay.
 */
function handleToggle(isEnabled) {
    if (isEnabled) {
        console.log("Tactile Bridge: Initializing high-performance touch overlay...");
        // Future: Inject the transparent full-screen overlay here
    } else {
        console.log("Tactile Bridge: Disabling overlay.");
        // Future: Remove/Hide the overlay
    }
}