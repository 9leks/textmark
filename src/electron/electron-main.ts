import { app, BrowserWindow } from 'electron'
import * as path from 'path'

await whenReady({
  url: 'http://localhost:8000/',
  devTools: true,
  onClose: () => {
    console.log('Textmark closed!')
  },
})

/* ################################################################################################################# */

interface ElectronWindowParams {
  url: string
  onClose: () => void
  devTools?: boolean
}

let _browser: BrowserWindow

async function whenReady(params: ElectronWindowParams): Promise<void> {
  app.on('ready', createWindow(params))
  await app.whenReady()

  app.on('window-all-closed', closeWindow(params.onClose))
  await openWindow(params.url)
}

function createWindow(params: ElectronWindowParams): () => void {
  return () => {
    _browser = new BrowserWindow({
      webPreferences: {
        spellcheck: false,
        sandbox: true,
        contextIsolation: true,
        preload: path.resolve(__dirname, 'electron-preload.js'),
      },
    })

    if (params.devTools) {
      _browser.webContents.on('did-finish-load', () => {
        _browser.webContents.openDevTools({ mode: 'detach' })
        _browser.focus()
      })
    }
  }
}

function closeWindow(callback?: () => void): () => void {
  return () => {
    _browser = null
    app.quit()

    if (callback) {
      callback()
    }
  }
}

async function openWindow(url: string): Promise<void> {
  try {
    await _browser.loadURL(url)
  } catch (e) {
    console.error(e)
  }
}
