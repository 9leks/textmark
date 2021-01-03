import XTextArea from './x-textarea'
import { isChunk, isLine } from './@types/helpers'

export function handleMouseDown(this: XTextArea, e: MouseEvent): void {
  const el = e.composedPath()[0] as TextAreaElement
  const charWidth = this.getCharacterWidth()
  const leftOffset = Math.max(0, e.pageX - el.getBoundingClientRect().left)

  if (isLine(el)) {
    this.x = leftOffset < charWidth ? 0 : this.lines[el['app-offset-y']].length
    this.y = el['app-offset-y']
  } else if (isChunk(el)) {
    const xOffset = el['app-offset-x']
    const charOffset = (charWidth / 2 < leftOffset ? Math.ceil : Math.trunc)(leftOffset / charWidth)
    this.x = xOffset + charOffset
    this.y = el.parentElement['app-offset-y']
  }
}

export function handleMouseMove(this: XTextArea, e: MouseEvent): void {
  if (e.buttons === 1 && this.shadowRoot.getSelection().toString().length > 0) {
    const caret = this.shadowRoot.querySelector<HTMLSpanElement>('#caret')
    if (caret !== null) {
      caret.remove()
    }
  }
}

export function handleMouseUp(this: XTextArea, e: MouseEvent): void {
  // TODO: place cursor at correct position
}

export function handleClick(this: XTextArea, e: MouseEvent): void {
  const caret = this.shadowRoot.querySelector<HTMLSpanElement>('#caret')
  if (caret !== null) {
    caret.remove()
  }

  const selection = this.shadowRoot.getSelection()

  if (e.detail === 2) {
    // TODO: solve for text larger than max chunk size
  }

  if (e.detail === 3) {
    const line = selection.anchorNode.parentElement.parentElement as TextAreaElement

    if (isLine(line)) {
      selection.selectAllChildren(line)
    }
  }
}
