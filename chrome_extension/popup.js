const STORAGE_KEY = "tactile_tabletop_mode_active";

// Update the UI based on storage
function updateUI() {
  chrome.storage.local.get([STORAGE_KEY], (result) => {
    const isActive = result[STORAGE_KEY] === true;
    const statusText = document.getElementById('status-text');
    if (statusText) {
        statusText.innerText = isActive ? "SHIELD ACTIVE" : "SHIELD INACTIVE";
        statusText.style.color = isActive ? "#4caf50" : "#e74c3c";
    }
  });
}

// Manual refresh to ensure storage is synced
document.getElementById('refresh-btn').addEventListener('click', () => {
  updateUI();
  // Send a message to the Howcontent script to force a re-check
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "RECHECK_STATUS" });
    }
  });
});

// Listen for storage changes to update the popup in real-time
chrome.storage.onChanged.addListener((changes) => {
  if (changes[STORAGE_KEY]) {
    updateUI();
  }
});

// Initial load
updateUI();