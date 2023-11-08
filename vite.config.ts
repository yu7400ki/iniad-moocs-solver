import { crx, defineManifest } from "@crxjs/vite-plugin";
import { defineConfig } from "vite";

const manifest = defineManifest({
  manifest_version: 3,
  name: "Moocs Solver",
  version: "0.0.1",
  permissions: ["storage"],
  action: {
    default_popup: "index.html",
  },
});

export default defineConfig({
  plugins: [crx({ manifest })],
});
