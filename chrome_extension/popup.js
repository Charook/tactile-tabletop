// Log when the popup is opened
console.log("Tactile Bridge Popup: Initialized and listening...");

// Listen for updates from the content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Tactile Bridge Popup: Received message:", message);

    if (message.type === "LOG_ENTRY") {
        const logs = document.getElementById('debug-logs');
        if (logs) {
            // Remove the "Waiting" message on first real entry
            if (logs.innerText.includes("Waiting for events...")) {
                logs.innerHTML = "";
            }

            const entry = document.createElement('div');
            entry.className = 'log-entry';
            entry.style.marginBottom = "4px";
            entry.style.borderBottom = "1px solid #222";
            entry.style.paddingBottom = "2px";
            
            const time = message.payload.time || new Date().toLocaleTimeString();
            
            entry.innerHTML = `
                <span style="color: #666;">[${time}]</span> 
                <span style="color: #3b82f6; font-weight: bold;">${message.payload.action}</span>: 
                ${JSON.stringify(message.payload.data)}
            `;
            logs.prepend(entry);
        }
    }
    // Acknowledge receipt
    sendResponse({ status: "received" });
});