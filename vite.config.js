import { defineConfig } from 'vite';
import { resolve } from 'path';
import webExtension from 'vite-plugin-web-extension';


const root = resolve(__dirname, "src");
const manifest = resolve(__dirname, "src/manifest.json");
const dist = resolve(__dirname, "dist");

export default defineConfig(({ mode }) => {
  const isWatchMode = mode === "development" || mode === "serve";
  return {
    root: root,
    publicDir: root,
    build: {
      outDir: dist,
      minify: isWatchMode ? false : "esbuild", 
      sourcemap: isWatchMode ? "inline" : false,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          popup: resolve(__dirname, "src/popup/popup.html")
        },
      },
    },
    plugins: [
      webExtension({
        manifest: manifest,
        disableAutoLaunch: true,
        libModeViteConfig: () => ({
          build: {
            minify: "terser", 
            cssMinify: "esbuild",
          },
        }),
        webExtConfig: {
          entry: {
            popup: resolve(__dirname, 'src/popup/popup.html'),
            popup_js: resolve(__dirname, 'src/popup/popup.js'),
            background: resolve(__dirname, 'src/background.js'),
            content_script: resolve(__dirname, 'src/content/content_script.js'),
          },
          browser: "none",
        },
      }),
    ],
  };
});
