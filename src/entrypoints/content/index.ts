import { Request } from "../../types";
import { getRowsToExport, extractDataFromRows } from "./utils";
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
      }
    })
  },
})
