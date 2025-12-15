import './style.css';
import { Request, Response, ExportSetting, AutoSelectRequest } from '@/types';
import { convertToCSV } from '../content/utils';
document.querySelector<HTMLDivElement>('#main')!.innerHTML = `
<div class="popup-content">
  <div class="header">
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
        <button id="autoSelectBtn" class="btn">Start</button>
      </div>
    </div>
    <textarea id="autoSelectTextarea" placeholder="Paste route list here..." class="auto-select" row="12"></textarea>
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

async function loadTheme() {
  const themeSelect = document.querySelector<HTMLSelectElement>("[data-theme-options]");
  const stored = await browser.storage.sync.get(["theme-preference"]);
  if (stored["theme-preference"]) {
    themeSelect!.value = stored["theme-preference"];
  }
  themeSelect?.addEventListener("change", async (e) => {
    const value = (e.target as HTMLSelectElement).value;
    await browser.storage.sync.set({ "theme-preference": value });
  })
}

const statusMessageClient = document.querySelector<HTMLParagraphElement>("#status");
function updateClientMessageStatus(message: string, type: "info" | "error" | "success" = "info") {
  statusMessageClient!.textContent = message;
}

async function handleProcess(setting: ExportSetting, action: "COPY" | "DOWNLOAD") {
  try {
    updateClientMessageStatus("Trying to connect to USPS page...");
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    const activeTabID = tabs[0].id;
    if (!activeTabID) {
      throw new Error("No active tab found.");
    }
    const message: Request = { action: "SCRAPE", setting };
    updateClientMessageStatus("Scanning USPS audience table.");
    const response = await browser.tabs.sendMessage(activeTabID, message) as Response;

    if (!response.success || !response.data) {
      throw new Error(response.error || "Unknown error from this page.");
    }

    const data = response.data;
    updateClientMessageStatus(`Processing ${data.length} rows...`);


    const csvString = convertToCSV(data);
    if (action === "COPY") {
      await navigator.clipboard.writeText(csvString);
      updateClientMessageStatus(`Copied ${data.length} rows to clipboard.`, "success");
    } else {
      downloadFile(csvString, setting);
      updateClientMessageStatus(`Downloaded ${data.length} rows.`, "success");
    }
  } catch (err: any) {
    console.log(err);
    if (err.message.includes("Receiving end does not exist")) {
      updateClientMessageStatus("Error: Refresh the USPS page and try again.", "error");
    } else {
      updateClientMessageStatus(`Error: ${err.message}`, "error");
    }
  }
}

function downloadFile(content: string, setting: string) {
  const date = new Date().toISOString().slice(0, 10);
  const filename =  `eddm_export_${setting}_${date}.csv`;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  document.body.removeChild(link);
}

const settingModes = {
  copySelectedRoutes: "copySelectedBtn",
  copyAllRoutes: "copyAllBtn",
  exportSelectedRoutes: "exportSelectedBtn",
  exportAllRoutes: "exportAllBtn"
}

const autoSelectBtn = document.querySelector<HTMLButtonElement>("#autoSelectBtn");
const autoSelectTextarea = document.querySelector<HTMLTextAreaElement>("#autoSelectTextarea");
document.addEventListener("DOMContentLoaded", () => {
  loadTheme();
  updateClientMessageStatus("Ready to export or copy routes...");
  document.querySelector(`#${settingModes.copySelectedRoutes}`)?.addEventListener("click", () => handleProcess("SELECTED", "COPY"));
  document.querySelector(`#${settingModes.copyAllRoutes}`)?.addEventListener("click", () => handleProcess("ALL", "COPY"));
  document.querySelector(`#${settingModes.exportSelectedRoutes}`)?.addEventListener("click", () => handleProcess("SELECTED", "DOWNLOAD"));
  document.querySelector(`#${settingModes.exportAllRoutes}`)?.addEventListener("click", () => handleProcess("ALL", "DOWNLOAD"));

  autoSelectBtn?.addEventListener("click", async () => {
    const rawText = autoSelectTextarea?.value;
    console.log(rawText);
    if (!rawText || !rawText.trim()) {
      updateClientMessageStatus("Please paste a list of routes first.", "error");
      return;
    }

    try {
      updateClientMessageStatus("Processing route list...");
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      const activeTabID = tabs[0].id;
      if (!activeTabID) {
        throw new Error("No active tab.");
      }

      const message: AutoSelectRequest = {
        action: "AUTO_SELECT",
        routes: rawText
      };
      const response = await browser.tabs.sendMessage(activeTabID, message) as Response;
      console.log(response);
      if (response.stats) {
        const { found, newlyChecked, alreadyChecked } = response.stats;
        updateClientMessageStatus(
          `Done. Found ${found} routes. Checked ${newlyChecked} new. (${alreadyChecked} were already set).`, "success"
        );
      }

    } catch (err: any) {
      console.error(err);
      updateClientMessageStatus(`Error: ${err.message}`, "error");
    }
  });
});
