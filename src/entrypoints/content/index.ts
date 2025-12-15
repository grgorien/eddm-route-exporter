import { Request } from "../../types";
import { getRowsToExport, extractDataFromRows, normalizeRouteInput, autoSelectRoutes } from "./utils";
export default defineContentScript({
  matches: ["https://eddm.usps.com/eddm/select-routes.htm*"],
  main() {
    browser.runtime.onMessage.addListener((message: Request, _, sendResponse) => {
      if (message.action === "SCRAPE") {
        try {
          const rows = getRowsToExport(message.setting);
          const rawData = extractDataFromRows(rows);
          sendResponse({ success: true, data: rawData });
        } catch (error) {
          const errMessage = error instanceof Error ? error.message : "Error: unknown";
          sendResponse({ success: false, error: errMessage });
        }
      } else if (message.action === "AUTO_SELECT") {
        try {
          const cleanList = normalizeRouteInput(message.routes);
          if (cleanList.length === 0) {
            sendResponse({ success: false, error: "No valid route IDs found in text." });
          } else {
            const stats = autoSelectRoutes(cleanList);
            sendResponse({ success: true, stats });
          }
        } catch (error) {
          const errMessage = error instanceof Error ? error.message : "Selection failed.";
          sendResponse({ success: false, error: errMessage });
        }
      }
      return true;
    })
  },
})
