import { app, MenuItemConstructorOptions } from 'electron'

export default function getTemplate(): MenuItemConstructorOptions[] {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdorCtrl+N',
        },
        {
          type: 'separator',
        },
        {
          label: 'Open...',
          accelerator: 'CmdorCtrl+O',
        },
        {
          label: 'Open Recent',
          role: 'recentDocuments',
          submenu: [
            { label: 'Clear Recently Opened', role: 'clearRecentDocuments' },
          ],
        },
        {
          type: 'separator',
        },
        {
          label: 'Save',
          accelerator: 'CmdorCtrl+S',
        },
        {
          label: 'Save As...',
          accelerator: 'Shift+CmdorCtrl+S',
        },
        {
          type: 'separator',
        },
        {
          label: 'Close Window',
          accelerator: 'CmdorCtrl+W',
        },
        {
          label: 'Reopen Closed Window',
          accelerator: 'Shift+CmdorCtrl+T',
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn more about Textmark',
        },
      ],
    },
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.name,
      submenu: [
        { type: 'separator' },
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    })

    if ('push' in template[2].submenu) {
      template[2].submenu.push(
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
        }
      )
    }

    template[4].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' },
    ]
  }
  return template
}
