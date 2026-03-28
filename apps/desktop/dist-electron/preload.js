//#region src/preload.ts
require("electron").contextBridge.exposeInMainWorld("desktop", { platform: process.platform });
//#endregion

//# sourceMappingURL=preload.js.map