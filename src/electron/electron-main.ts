import { app, BrowserWindow, clipboard } from 'electron'
import * as path from 'path'
import { createMenu } from './menu'

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

  createMenu({
    onCopy() {
      _browser.webContents.copy()

      setTimeout(() => {
        const cp = clipboard.readHTML()
        const meta = "<meta charset='utf-8'>"

        clipboard.writeText(
          cp
            .slice(meta.length)
            .replace(/\s*(class|style|app-focused)(="[^"]*")?\s*/g, '')
            .replace(/<div>(.*?)<\/div>/g, '$1\n')
            .replace(/<span>(.*?)<\/span>/g, '$1')
            .replace(/<(br|div)>/g, '')
            .replace(/<span id="caret">.<\/span>/, '')
        )
      }, 50)
    },
  })

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
