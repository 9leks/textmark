interface LineElement extends HTMLDivElement {
  posY: number
  focused: number
  parentElement: HTMLDivElement
  previousElementSibling: LineElement
  nextElementSibling: LineElement
}

interface ChunkElement extends HTMLSpanElement {
  posX: number
  parentElement: LineElement
  previousElementSibling: ChunkElement
  nextElementSibling: ChunkElement
}

type TextAreaElement = LineElement | ChunkElement
