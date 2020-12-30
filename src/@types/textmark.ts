interface ElectronWindowParams {
  url: string
  onClose: () => void
  devTools?: boolean
}

interface LineElement extends HTMLDivElement {
  appOffsetY: number
  focused: number
}

interface ChunkElement extends HTMLSpanElement {
  appChunkN: number
  parentElement: LineElement
}

type TextAreaElement = LineElement | ChunkElement
