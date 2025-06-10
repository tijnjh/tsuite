import { defineConfig } from "tsdown/config";

import pkg from "./package.json";

const banner = `/**
* ${pkg.name} v${pkg.version}
* tijn.dev
* @license MPL-2.0
**/`;

export default defineConfig({
  exports: true,
  entry: [
    "src/index.ts",
    "src/create-node.ts",
    "src/create-request.ts",
    "src/create-state.ts",
    "src/effetch.ts",
    "src/hug-text.ts",
    "src/load-image-with-fallback.ts",
    "src/map-elements-by-id.ts",
    "src/type-helpers.ts",
  ],
  platform: "neutral",
  outputOptions: { banner },
});
