import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    permissions: ["storage", "activeTab"],
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
