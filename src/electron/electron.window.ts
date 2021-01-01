import { app, BrowserWindow } from 'electron'
import * as path from 'path'

let browser: BrowserWindow = null

export async function whenReady(params: ElectronWindowParams): Promise<void> {
  app.on('ready', createWindow)
  await app.whenReady()

  app.on('window-all-closed', onClose(params.onClose))
  await openWindow(params.url)

  if (params.devTools) {
    openDevTools()
  }
}

function createWindow(): void {
  browser = new BrowserWindow({
    webPreferences: {
      spellcheck: false,
      sandbox: true,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'electron.preload.js'),
    },
  })
}

function onClose(callback?: () => void): () => void {
  return () => {
    browser = null
    app.quit()

    if (callback) {
      callback()
    }
  }
}

async function openWindow(url: string, attempt = 0): Promise<void> {
  try {
    await browser.loadURL(url)
  } catch (e) {
    console.error(e)
  }
}

function openDevTools(): void {
  browser.webContents.once('did-finish-load', () => {
    browser.webContents.openDevTools({ mode: 'detach' })
    browser.focus()
  })
}
