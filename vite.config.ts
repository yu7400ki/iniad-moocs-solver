import { crx, defineManifest } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";

const manifest = defineManifest({
  manifest_version: 3,
  name: "INIAD Moocs Solver",
  version: "0.0.2",
  permissions: ["storage"],
  action: {
    default_popup: "page/popup.html",
  },
  content_scripts: [
    {
      matches: ["https://moocs.iniad.org/courses/*"],
      js: ["src/scripts/content.ts"],
    },
  ],
  icons: {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png",
  },
});

export default defineConfig({
  plugins: [crx({ manifest })],
});

export { manifest };
