let node_path = require("node:path");
let electron = require("electron");
//#region src/main.ts
const isDevelopment = Boolean(process.env.VITE_DEV_SERVER_URL);
const resolveRendererEntry = () => (0, node_path.resolve)(process.cwd(), "../web/dist/index.html");
const createWindow = async () => {
	const window = new electron.BrowserWindow({
		width: 900,
		height: 700,
		minWidth: 640,
		minHeight: 480,
		webPreferences: {
			preload: (0, node_path.join)(process.cwd(), "dist-electron/preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
			sandbox: true
		}
	});
	if (isDevelopment) {
		await window.loadURL(process.env.VITE_DEV_SERVER_URL ?? "http://127.0.0.1:5173");
		window.webContents.openDevTools({ mode: "detach" });
		return window;
	}
	await window.loadFile(resolveRendererEntry());
	return window;
};
electron.app.on("ready", async () => {
	try {
		await createWindow();
	} catch (error) {
		console.error("Failed to bootstrap Electron", error);
		electron.app.quit();
	}
});
electron.app.on("activate", async () => {
	if (electron.BrowserWindow.getAllWindows().length === 0) try {
		await createWindow();
	} catch (error) {
		console.error("Failed to create window", error);
	}
});
electron.app.on("window-all-closed", () => {
	if (process.platform !== "darwin") electron.app.quit();
});
//#endregion

//# sourceMappingURL=main.js.map