interface ElectronWindowParams {
  url: string
  onClose: () => void
  devTools?: boolean
}

interface LineElement extends HTMLSpanElement {
  appOffsetY: number
  focused: boolean
}

interface CharElement extends HTMLSpanElement {
  appOffsetX: number
  appFocused: boolean
  parentElement: LineElement
}

type TextAreaElement = LineElement | CharElement
