import path from 'path'
import { app, session, BrowserWindow, Menu, screen } from 'electron'
import ElectronStore from 'electron-store'
import contextMenu from 'electron-context-menu'
import getTemplate from './menu'

let win: BrowserWindow | null
let store: ElectronStore | null

app.on('ready', () => {
  contextMenu()

  const displays = screen.getAllDisplays()
  const externalDisplay = displays.find(display => {
    return display.bounds.x !== 0 || display.bounds.y !== 0
  })

  win = new BrowserWindow({
    width: 1000,
    height: 800,
    x: externalDisplay.bounds.x + 800,
    y: externalDisplay.bounds.y + 200,

    webPreferences: {
      spellcheck: false,
      sandbox: true,
      contextIsolation: true,
      preload: path.resolve(__dirname, 'preload.js'),
    },
  })

  win.webContents.on('did-frame-finish-load', () => {
    win.webContents.openDevTools({ mode: 'detach' })
    win.webContents.on('devtools-opened', () => {
      win.focus()
    })
  })

  store = new ElectronStore()
  store.clear()

  Menu.setApplicationMenu(Menu.buildFromTemplate(getTemplate()))
  win.loadURL('http://localhost:4000/')
  session.defaultSession.loadExtension(path.join(__dirname, 'lib/devtools'))
})

app.on('window-all-closed', () => {
  win = null
  app.quit()
})
