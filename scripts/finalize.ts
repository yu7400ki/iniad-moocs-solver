import fs from "fs";

const targetFile = "dist/manifest.json";

const browserSpecificSettings = {
  gecko: {
    id: "{252971c5-e196-454f-9958-e37c45ab8dea}",
    strict_min_version: "109.0",
  },
};

const manifest = JSON.parse(fs.readFileSync(targetFile, "utf8"));
const browserSpecificManifest = {
  ...manifest,
  browser_specific_settings: { ...browserSpecificSettings },
};

fs.writeFileSync(targetFile, JSON.stringify(browserSpecificManifest, null, 2));
