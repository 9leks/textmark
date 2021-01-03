declare interface XChangeEvent {
  value: string
  x: number
  y: number
}

declare interface TextAreaProps {
  value: string
  onChange: (e: CustomEvent<XChangeEvent>) => void
  fontSize: string
  fontFamily: string
  lineHeight: string
  x: number
  y: number
}

declare interface Conf {
  lineHeight: string
  fontSize: string
  fontFamily: string
}

declare interface Store {
  text: string
  lineCount: number
  x: number
  y: number
  conf: Conf
  setText: (text: string) => void
  setCoords: (x: number, y: number) => void
}
