import './style.css';
import eagleIcon from "/icon/128.png";

document.querySelector<HTMLDivElement>('#main')!.innerHTML = `
<div class="popup-content">
  <div class="header">
      <img src="${eagleIcon}" class="logo" alt="logo" />
      <h1>USPS Every Door Direct Mail Route Exporter</h1>
    </div>
      <div class="group-action">
        <h2>Copy</h2>
        <div class="button-grid">
          <button id="copySelectedBtn" class="btn">Copy Selected Routes</button>
          <button id="copyAllBtn" class="btn">Copy All Routes</button>
        </div>
      </div>

      <div class="group-action">
        <h2>Export</h2>
        <div class="button-grid">
          <button id="exportSelectedBtn" class="btn">Export Selected Routes to CSV</button>
          <button id="exportAllBtn" class="btn">Export All Routes to CSV</button>
        </div>
      </div>

      <div class="auto-select-box">
        <div class="auto-select-action">
          <div class="auto-select-content-box">
            <div class="auto-select-content">
              <h2>Bulk Route Selection:</h2>
              <span>Paste your route list below. The tool will find and check them automatically.</span>
            </div>
            <button class="btn">Start</button>
          </div>
        </div>
        <textarea placeholder="Paste route list here..." class="auto-select" row="12"></textarea>
      </div>

      <div class="status-box">
        <h2>Output:</h2>
        <p id="status" class="status-message"></p>
      </div>
    </div>

    <div id="theme-handler">
      <div class="theme-user-preference">
        <label> Theme:
          <select data-theme-options name="theme-preference">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
    </div>
  `;

type ThemePreference = {
  "theme-preference": string
}

async function loadThemePreference(): Promise<ThemePreference> {
  return await browser.storage.sync.get(["theme-preference"]);
}

let themeOptions = {};
const themePreferenceOptions = document.querySelector<HTMLSelectElement>("[data-theme-options]");
themePreferenceOptions?.addEventListener("change", async (event: Event) => {
  themeOptions = { "theme-preference": (event.target as HTMLOptionElement).value }
  await browser.storage.sync.set(themeOptions);
})

var statusMsg:HTMLElement | null = document.querySelector("#status");
statusMsg!.innerHTML = "Ready to export, copy, or check routes.";


var copySelectedBtn = document.querySelector<HTMLButtonElement>("#copySelectedBtn");
const modes = {
  copySelectedRoutes: "copySelectedRoutes",
  copyAllRoutes: "copyAllRoutes",
  exportSelectedRoutes: "exportSelectedRoutes",
  exportAllRoutes: "exportAllRoutes"
}
copySelectedBtn?.addEventListener("click", () => {
  browser.runtime.sendMessage({data: modes.exportSelectedRoutes });
})


document.addEventListener("DOMContentLoaded", () => {
  loadThemePreference().then(option => {
    themePreferenceOptions!.value = option["theme-preference"];
  });
})
