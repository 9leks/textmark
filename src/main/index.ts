import path from 'path'
import { app, session, BrowserWindow, Menu } from 'electron'
import Store from 'electron-store'
import contextMenu from 'electron-context-menu'
import getTemplate  from './menu'

contextMenu()
let win: BrowserWindow | null
let store: Store | null

app.on('ready', () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    x: 1900,
    y: 750,

    webPreferences: {
      spellcheck: false,
      sandbox: true,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'preload.js'),
    },
  })

  win.webContents.on('did-frame-finish-load', () => {
    win.webContents.openDevTools({ mode: 'detach' })
  })

  store = new Store()
  store.clear()

  Menu.setApplicationMenu(Menu.buildFromTemplate(getTemplate()))
  win.loadURL('http://localhost:4000/')
  session.defaultSession.loadExtension(path.join(__dirname, 'lib/devtools'))
})

app.on('window-all-closed', () => {
  win = null
  app.quit()
})
