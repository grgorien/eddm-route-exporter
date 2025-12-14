export default defineContentScript({
  matches: ["https://eddm.usps.com/eddm/select-routes.htm*"],
  main() {
    browser.runtime.onMessage.addListener((message, _, sendResponse) => {
      let now = new Date();
      console.info(now.toISOString())
      const TABLE_SELECTOR = "table.target-audience-table tbody";
      console.log(document.querySelectorAll(TABLE_SELECTOR));
      return true;
    })
  },
})
