import { app, BrowserWindow, screen, session } from 'electron'
import buildContextMenu from 'electron-context-menu'
import ElectronStore from 'electron-store'
import path from 'path'
import buildMenubar from './menu'

let win: BrowserWindow | null
let store: ElectronStore | null

app.on('ready', () => {
  const externalDisplay = screen.getAllDisplays().find(display => display.bounds.x !== 0 || display.bounds.y !== 0)

  win = new BrowserWindow({
    width: 1000,
    height: 800,
    x: externalDisplay.bounds.x + 800,
    y: externalDisplay.bounds.y + 200,

    webPreferences: {
      spellcheck: false,
      sandbox: true,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'preload.js')
    }
  })

  win.webContents.on('did-frame-finish-load', () => {
    win.webContents.openDevTools({ mode: 'detach' })
    win.webContents.on('devtools-opened', () => {
      win.focus()
    })
  })

  store = new ElectronStore()
  store.clear()

  buildContextMenu()
  buildMenubar()

  win.loadURL('http://localhost:4000/')
  session.defaultSession.loadExtension(path.join(__dirname, 'lib/devtools'))
})

app.on('window-all-closed', () => {
  win = null
  app.quit()
})
