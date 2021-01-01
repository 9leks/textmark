declare interface Store {
  text: string
  x: number
  y: number
  setText: (text: string) => void
  setCoords: (x: number, y: number) => void
}

declare interface XInputEvent {
  value: string
  x: number
  y: number
}

declare interface TextAreaProps {
  value: string
  onChange: (e: CustomEvent<XInputEvent>) => void
  fontSize: string
  fontFamily: string
  lineHeight: string
  x: number
  y: number
}
