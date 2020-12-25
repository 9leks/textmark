import { app, BrowserWindow } from "electron"
import * as path from "path"

export class ElectronWindow {
  static browser: BrowserWindow

  static async whenReady(params: ElectronWindowParams): Promise<void> {
    app.on("ready", ElectronWindow.createWindow)
    await app.whenReady()

    app.on("window-all-closed", ElectronWindow.onClose(params.onClose))
    ElectronWindow.openWindow(params.url)

    if (params.devTools) {
      ElectronWindow.openDevTools()
    }
  }

  private static createWindow(): void {
    ElectronWindow.browser = new BrowserWindow({
      webPreferences: {
        spellcheck: false,
        sandbox: true,
        contextIsolation: true,
        preload: path.resolve(__dirname, "electron.preload.js"),
      },
    })
  }

  private static onClose(callback?: () => void): () => void {
    return () => {
      ElectronWindow.browser = null
      app.quit()

      if (callback) {
        callback()
      }
    }
  }

  private static openWindow(url: string) {
    // ensure webpack dev server has started
    setTimeout(() => {
      ElectronWindow.browser.loadURL(url)
    }, 500)
  }

  private static openDevTools() {
    ElectronWindow.browser.webContents.once("did-finish-load", () => {
      ElectronWindow.browser.webContents.openDevTools({ mode: "detach" })
      ElectronWindow.browser.focus()
    })
  }
}
