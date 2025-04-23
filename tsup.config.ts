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
  ])
);

export default defineConfig([
  {
    dts: true,
    entry: ["src/index.ts"],
    format: ["cjs", "esm", "iife"],
    globalName: "tsuite",
    minify: true,
    sourcemap: true,
    clean: true,
  },
  {
    dts: true,
    entry: functionEntries,
    format: ["cjs", "esm", "iife"],
    globalName: "tsuite",
    sourcemap: true,
    minify: true,
    clean: true,
  },
]);
