import OBR from "@owlbear-rodeo/sdk";

const toggle = document.getElementById('overlay-toggle');
const statusBox = document.getElementById('status-box');

/**
 * Sends a message from the OBR Iframe to the parent window.
 * The Chrome Extension content script will be listening for this.
 */
function sendToChromeExtension(action, data) {
    const message = {
        source: "TACTILE_TABLETOP_OBR",
        action: action,
        data: data,
        timestamp: Date.now()
    };
    
    // We send to window.parent because OBR extensions are inside an iframe
    window.top.postMessage(message, "*");
    
    statusBox.innerText = `Sent: ${action} (${data.enabled})`;
}

OBR.onReady(() => {
    statusBox.innerText = "OBR Connected. Ready to toggle.";

    toggle.addEventListener('change', (e) => {
        const isEnabled = e.target.checked;
        
        // 1. Update OBR internal state if needed (future goal)
        // 2. Notify the Chrome Extension
        sendToChromeExtension("TACTILE_TOGGLE", {
            enabled: isEnabled
        });
    });
});