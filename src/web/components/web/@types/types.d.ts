interface LineElement extends HTMLDivElement {
  'app-offset-y': number
  focused: number
  parentElement: HTMLDivElement
  previousElementSibling: LineElement
  nextElementSibling: LineElement
}

interface ChunkElement extends HTMLSpanElement {
  'app-offset-x': number
  parentElement: LineElement
  previousElementSibling: ChunkElement
  nextElementSibling: ChunkElement
}

type TextAreaElement = LineElement | ChunkElement
