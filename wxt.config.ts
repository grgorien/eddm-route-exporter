import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    action: {
      default_title: "Export USPS EDDM® routes into a .csv file or quickly copy routes directly into your system's clipboard."
    },
    permissions: ["storage"],
    commands: {
      "_execute_action": {
        suggested_key: {
          default: "Ctrl+Shift+X",
          mac: "Command+Shift+X"
        },
        description: "Open the extension popup"
      }
    }
  },
  srcDir: "src",
  outDir: "dist",
  publicDir: "static"
});
