import { contextBridge } from 'electron'

const dummy = {
  file: 'lorem',
  text:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\nLorem Ipsum is simply dummy text of the printing and typesetting industry.\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry.\n\nLorem Ipsum is simply dummy text of the printing and typesetting industry.\nLorem Ipsum is simply dummy text of the printing and typesetting industry.\n"
}

contextBridge.exposeInMainWorld('main', {
  onReady: (cb: (lines: string[]) => void) => {
    cb(dummy.text.split('\n'))
  },
})
