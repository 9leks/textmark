declare interface ElectronWindowParams {
  url: string
  onClose: () => void
  devTools?: boolean
}

declare interface Store {
  text: string
  x: number
  y: number
  setText: (text: string) => void
  setCoords: (x: number, y: number) => void
}

declare interface InputEvent {
  value: string
  x: number
  y: number
}

declare interface XTextAreaProps {
  ref: React.MutableRefObject<import('../view/components/web/x-textarea').default>
  value: string
  'font-size': string
  'font-family': string
  'line-height': string
  x: number
  y: number
}

declare interface TextAreaProps {
  value: string
  onChange: (e: CustomEvent<InputEvent>) => void
  fontSize: string
  fontFamily: string
  lineHeight: string
  x: number
  y: number
}

declare interface LineElement extends HTMLDivElement {
  'app-offset-y': number
  focused: number
}

declare interface ChunkElement extends HTMLSpanElement {
  'app-offset-chunk': number
  parentElement: LineElement
}

declare type TextAreaElement = LineElement | ChunkElement
