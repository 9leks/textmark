import { contextBridge } from 'electron'

const dummy = {
  file: 'lorem',
  text:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry.\n\nLorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.\n\nIt was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like\nAldus PageMaker including versions of Lorem Ipsum.",
}

function split(text: string, width = 80): string[][] {
  const lines = text.split('\n')
  return lines.map((line: string) => {
    if (line.length <= width) {
      return [line]
    }

    return line.match(new RegExp(`.{1,${width}}(?=\\b.*\\b)\\.?`, 'g'))
  })
}

contextBridge.exposeInMainWorld('main', {
  onReady: (cb: (file: string, contents: string[][]) => void) => {
    cb(dummy.file, split(dummy.text))
  },
})
