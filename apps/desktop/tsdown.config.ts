import { defineConfig } from "tsdown";

const shared = {
  external: ["electron"],
  format: "cjs" as const,
  outDir: "dist-electron",
  platform: "node" as const,
  sourcemap: true,
  outExtensions: () => ({ js: ".js" }),
};

export default defineConfig([
  {
    ...shared,
    clean: true,
    entry: ["src/main.ts"],
  },
  {
    ...shared,
    entry: ["src/preload.ts"],
  },
]);
