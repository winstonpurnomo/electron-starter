import { join, resolve } from "node:path";

import { app, BrowserWindow } from "electron";

const isDevelopment = Boolean(process.env.VITE_DEV_SERVER_URL);

const resolveRendererEntry = () =>
  resolve(process.cwd(), "../web/dist/index.html");

const createWindow = async () => {
  const window = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 640,
    minHeight: 480,
    webPreferences: {
      preload: join(process.cwd(), "dist-electron/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  if (isDevelopment) {
    await window.loadURL(
      process.env.VITE_DEV_SERVER_URL ?? "http://127.0.0.1:5173"
    );
    window.webContents.openDevTools({ mode: "detach" });
    return window;
  }

  await window.loadFile(resolveRendererEntry());
  return window;
};

app.on("ready", async () => {
  try {
    await createWindow();
  } catch (error: unknown) {
    console.error("Failed to bootstrap Electron", error);
    app.quit();
  }
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    try {
      await createWindow();
    } catch (error: unknown) {
      console.error("Failed to create window", error);
    }
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
