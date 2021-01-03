import XTextArea from './x-textarea'

export function getCharacterWidth(this: XTextArea): number {
  const fontSize = Number(this.fontSize.slice(0, -2))
  const letterSpacing = 1
  return letterSpacing + 0.5 * fontSize + letterSpacing
}

export function setCaret(this: XTextArea, x: number, y: number): void {
  const precaret = this.shadowRoot.querySelector('#caret')
  if (this.shadowRoot.contains(precaret)) {
    const line = precaret.parentElement.parentElement as LineElement
    precaret.remove()

    if (line.childElementCount === 1 && !line.firstElementChild.hasChildNodes()) {
      line.firstElementChild.remove()
      const br = document.createElement('br')
      line.append(br)
    }
  }

  const line = this.shadowRoot.querySelector('#lines').children[y] as LineElement

  if (line.children[0] instanceof HTMLBRElement) {
    line.children[0].remove()
  }

  const chunks = line.children

  if (!chunks[0]) {
    const chunk = document.createElement('span') as ChunkElement
    chunk.className = 'chunk'
    chunk.style.height = this.lineHeight
    chunk['app-offset-x'] = 0
    line.append(chunk)
  }

  const chunk = find([...chunks] as ChunkElement[], x)

  const offset = chunk['app-offset-x']
  const caret = document.createElement('span')
  const left = x - offset

  caret.id = 'caret'
  caret.innerText = '\u00a0'
  caret.style.left = `calc(${left}ch - 2px)`

  chunk.append(caret)
}

function find(chunks: ChunkElement[], x: number): ChunkElement {
  let start = 0
  let end = chunks.length - 1

  while (start <= end) {
    const mid = Math.trunc((start + end) / 2)

    if (chunks[mid]['app-offset-x'] <= x) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }

  return chunks[end]
}
