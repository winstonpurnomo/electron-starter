import { spawn } from "node:child_process";
import { watch } from "node:fs";
import { dirname, join, resolve as resolvePath } from "node:path";
import { fileURLToPath } from "node:url";

import waitOn from "wait-on";

const __dirname = dirname(fileURLToPath(import.meta.url));
const desktopDir = resolvePath(__dirname, "..");
const port = Number(process.env.ELECTRON_RENDERER_PORT ?? 5173);
const devServerUrl =
  process.env.VITE_DEV_SERVER_URL ?? `http://127.0.0.1:${port}`;
const requiredFiles = [
  resolvePath(desktopDir, "dist-electron/main.js"),
  resolvePath(desktopDir, "dist-electron/preload.js"),
];

let currentApp = null;
let restartTimer = null;
let shuttingDown = false;

await waitOn({
  resources: [
    `tcp:${port}`,
    ...requiredFiles.map((filePath) => `file:${filePath}`),
  ],
});

const startApp = () => {
  if (shuttingDown || currentApp !== null) {
    return;
  }

  currentApp = spawn(
    resolvePath(
      desktopDir,
      "node_modules",
      ".bin",
      process.platform === "win32" ? "electron.cmd" : "electron"
    ),
    ["dist-electron/main.js"],
    {
      cwd: desktopDir,
      env: {
        ...process.env,
        VITE_DEV_SERVER_URL: devServerUrl,
      },
      stdio: "inherit",
    }
  );

  currentApp.once("exit", () => {
    currentApp = null;
    if (!shuttingDown) {
      scheduleRestart();
    }
  });
};

const stopApp = async () => {
  if (currentApp === null) {
    return;
  }

  const app = currentApp;
  currentApp = null;

  await new Promise((resolve) => {
    app.once("exit", resolve);
    app.kill("SIGTERM");
  });
};

const scheduleRestart = () => {
  if (shuttingDown) {
    return;
  }

  if (restartTimer !== null) {
    clearTimeout(restartTimer);
  }

  restartTimer = setTimeout(async () => {
    restartTimer = null;
    await stopApp();
    startApp();
  }, 100);
};

watch(
  join(desktopDir, "dist-electron"),
  { persistent: true },
  (_eventType, fileName) => {
    if (typeof fileName !== "string") {
      return;
    }

    if (fileName === "main.js" || fileName === "preload.js") {
      scheduleRestart();
    }
  }
);

const shutdown = async (exitCode) => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (restartTimer !== null) {
    clearTimeout(restartTimer);
    restartTimer = null;
  }

  await stopApp();
  process.exit(exitCode);
};

startApp();

process.once("SIGINT", async () => {
  await shutdown(130);
});

process.once("SIGTERM", async () => {
  await shutdown(143);
});
