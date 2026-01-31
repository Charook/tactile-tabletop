import OBR from "@owlbear-rodeo/sdk";

// This is our main application logic
async function setup() {
  const statusElement = document.getElementById("status");
  const uiRoot = document.getElementById("ui-root");

  console.log("Tactile Tabletop: Script loading...");

  // Wait for the OBR SDK to be ready
  OBR.onReady(async () => {
    console.log("Tactile Tabletop: SDK is ready!");
    
    try {
      // Get information about the current user
      const role = await OBR.player.getRole();
      const name = await OBR.player.getName();

      console.log(`Tactile Tabletop: Logged in as ${name} (${role})`);

      statusElement.innerHTML = `Connected as: <strong>${name}</strong>`;
      
      // Basic Role identification logic
      if (role === "GM") {
        uiRoot.innerHTML = `
          <div class="role-badge">DM View</div>
          <p>This is where you will assign the Tabletop user.</p>
          <button id="test-btn" style="margin-top: 10px; padding: 8px; cursor: pointer;">Ping OBR</button>
        `;
        
        // Add a test button to ensure communication is two-way
        document.getElementById("test-btn").onclick = () => {
          OBR.notification.show(`Hello ${name}! The extension is working.`);
        };

      } else {
        uiRoot.innerHTML = `
          <div class="role-badge">Player View</div>
          <p>Waiting for DM to assign Tabletop role.</p>
        `;
      }
      
    } catch (error) {
      statusElement.innerText = "Error connecting to OBR data.";
      console.error("Tactile Tabletop: SDK Error:", error);
    }
  });
}

// Start the app
setup();