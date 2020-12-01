import * as path from 'path'
import { app, session, BrowserWindow } from 'electron'

let win: BrowserWindow | null

app.on('ready', () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      sandbox: true,
      contextIsolation: true,
    },
  })

  win.webContents.on('did-frame-finish-load', () => {
    win.webContents.once('devtools-opened', () => {
      win.focus()
    })
    win.webContents.openDevTools({ mode: 'detach' })
  })

  win.loadURL('http://localhost:4000/')
  session.defaultSession.loadExtension(path.join(__dirname, 'lib/devtools'))
})
