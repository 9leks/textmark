interface ElectronWindowParams {
  url: string
  onClose: () => void
  devTools?: boolean
}

interface TextAreaElement extends HTMLSpanElement {
  y: number
  x?: number
  focused: boolean
}
