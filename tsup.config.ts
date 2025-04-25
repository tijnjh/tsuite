import { defineConfig } from "tsup";
import fs from "fs";
import path from "path";

const srcDir = path.resolve(__dirname, "src");
const functions: Record<string, string> = {};

fs.readdirSync(srcDir, { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .forEach((dirent) => {
    functions[dirent.name] = dirent.name;
  });

const functionEntries = Object.fromEntries(
  Object.entries(functions).map(([key, value]) => [
    key,
    `src/${value}/index.ts`,
  ]),
);

const entries = { ...functionEntries, index: "src/index.ts" };

export default defineConfig([
  {
    dts: true,
    entry: entries,
    format: ["cjs", "esm", "iife"],
    globalName: "tsuite",
    sourcemap: true,
    minify: true,
    clean: true,
  },
]);
