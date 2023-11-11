import fs from "fs";

const targetFile = "dist/manifest.json";

const browserSpecificSettings = {
  gecko: {
    id: "{1ed38b94-487e-49ec-8d87-60e193937d13}",
    strict_min_version: "109.0",
  },
};

const manifest = JSON.parse(fs.readFileSync(targetFile, "utf8"));
const browserSpecificManifest = {
  ...manifest,
  browser_specific_settings: { ...browserSpecificSettings },
};

fs.writeFileSync(targetFile, JSON.stringify(browserSpecificManifest, null, 2));
