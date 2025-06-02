import { defineConfig } from "tsdown/config";

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
  ],
});
