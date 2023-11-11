import fs from "fs";

const targetFile = "dist/manifest.json";

const browserSpecificSettings = {
  gecko: {
    id: "{221bbd76-28c2-4e73-bc14-06fdb0ce8e99}",
    strict_min_version: "109.0",
  },
};

const manifest = JSON.parse(fs.readFileSync(targetFile, "utf8"));
const browserSpecificManifest = {
  ...manifest,
  browser_specific_settings: { ...browserSpecificSettings },
};

fs.writeFileSync(targetFile, JSON.stringify(browserSpecificManifest, null, 2));
