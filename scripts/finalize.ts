import fs from "node:fs";

const targetFile = "dist/manifest.json";

const additionalSettings = {
  browser_specific_settings: {
    gecko: {
      id: "{caee38ad-a097-4710-a375-89324d599b7f}",
      strict_min_version: "109.0",
      update_url: "https://raw.githubusercontent.com/yu7400ki/iniad-moocs-solver/main/updates.json"
    },
  },
};

const manifest = JSON.parse(fs.readFileSync(targetFile, "utf8"));
const browserSpecificManifest = {
  ...manifest,
  ...additionalSettings,
};

fs.writeFileSync(targetFile, JSON.stringify(browserSpecificManifest, null, 2));
