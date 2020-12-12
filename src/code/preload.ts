import { contextBridge } from 'electron'

const dummy = {
  file: 'lorem',
  text:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.\n\nIt has survived not only five centuries,\nbut also the leap into electronic typesetting, remaining essentially unchanged.\nIt was popularised in the 1960s with the release of Letraset\n\nsheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of\nLorem Ipsum."
}

contextBridge.exposeInMainWorld('main', {
  onReady: (cb: (lines: string[]) => void) => {
    cb(dummy.text.split('\n'))
  },
})
