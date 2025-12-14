import { defineConfig } from 'wxt';

export default defineConfig({
  manifest: {
    action: {
      default_title: "Export USPS EDDM® routes into a .csv file or quickly copy routes directly into your system's clipboard."
    }
  },
  srcDir: "src",
  outDir: "dist",
  publicDir: "static"
});
