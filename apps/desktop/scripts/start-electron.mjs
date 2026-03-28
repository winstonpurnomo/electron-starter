import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const desktopDir = resolve(__dirname, "..");

const child = spawn(
  resolve(
    desktopDir,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "electron.cmd" : "electron"
  ),
  ["dist-electron/main.js"],
  {
    cwd: desktopDir,
    env: process.env,
    stdio: "inherit",
  }
);

child.on("exit", (code, signal) => {
  if (signal !== null) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
