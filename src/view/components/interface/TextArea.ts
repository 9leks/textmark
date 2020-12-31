import { MobxReactionUpdate } from '@adobe/lit-mobx'
import { css, html, LitElement, TemplateResult } from 'lit-element'
import store from '../../store'
import InputHandler from '../inputhandler/InputHandler'

const MAX_CHUNK_SIZE = 30

function isLine(line: TextAreaElement): line is LineElement {
  return (<LineElement>line).appOffsetY !== undefined
}

function isChunk(chunk: TextAreaElement): chunk is ChunkElement {
  return (<ChunkElement>chunk).appChunkN !== undefined
}

export default class TextArea extends MobxReactionUpdate(LitElement) {
  constructor() {
    super()
    this.tabIndex = -1
  }

  firstUpdated() {
    document.addEventListener('mouseup', (evt: MouseEvent) => this.handleMouseUp(evt))
    this.addEventListener('mousedown', this.handleMouseDown)
    this.addEventListener('mousemove', this.handleMouseMove)
    this.addEventListener('keydown', this.handleKeyDown)
  }

  updated() {
    this.setCaret(store.x, store.y)
  }

  render(): TemplateResult {
    return html`
      ${store.lines.map((line, y) => {
        store.x // for mobx store tracking
        const chunks = line.match(new RegExp(`.{1,${MAX_CHUNK_SIZE}}`, 'g'))

        return html`
          <div class="line" .appOffsetY=${y} ?appFocused=${y === store.y}>
            ${!chunks
              ? html`<br />`
              : chunks.map((chunk, chunkOffset) => {
                  return html`<span class="chunk" .appChunkN=${chunkOffset}>${chunk}</span>`
                })}
          </div>
        `
      })}
    `
  }

  getCharacterWidth() {
    const fontSize = Number(getComputedStyle(this).getPropertyValue('--font-size').slice(0, -2))
    const letterSpacing = 1
    return letterSpacing + 0.5 * fontSize + letterSpacing
  }

  setCaret(x: number, y: number): void {
    const precaret = this.shadowRoot.querySelector('.caret')
    if (precaret) {
      const line = <LineElement>precaret.parentElement.parentElement
      precaret.remove()

      if (line.childElementCount === 1 && !line.firstElementChild.hasChildNodes()) {
        const br = document.createElement('br')
        line.append(br)
      }
    }

    const caret = document.createElement('span')
    const left = this.getCharacterWidth() * (x % MAX_CHUNK_SIZE)
    caret.className = 'caret'
    caret.innerText = '\u00a0'
    caret.style.left = `${left - 3}px`

    const line = this.shadowRoot.children[y]
    const chunkN = Math.floor(x / MAX_CHUNK_SIZE)

    if (line.children[chunkN] instanceof HTMLBRElement) {
      line.children[chunkN].remove()
    }

    if (!line.children[chunkN]) {
      const chunk = <ChunkElement>document.createElement('span')
      chunk.className = 'chunk'
      chunk.appChunkN = chunkN
      line.append(chunk)
    }

    const chunk = line.children[chunkN]
    chunk.append(caret)
  }

  handleMouseDown(evt: MouseEvent) {
    const el = <TextAreaElement>evt.composedPath()[0]
    const charWidth = this.getCharacterWidth()
    const leftOffset = Math.max(0, evt.pageX - el.getBoundingClientRect().left)

    if (isLine(el)) {
      const x = leftOffset < charWidth ? 0 : store.lines[el.appOffsetY].length
      const y = el.appOffsetY
      store.setCoords(x, y)
    } else if (isChunk(el)) {
      const charOffset = (charWidth / 2 < leftOffset ? Math.ceil : Math.floor)(leftOffset / charWidth)
      const x = el.appChunkN * MAX_CHUNK_SIZE + charOffset
      const y = el.parentElement.appOffsetY
      store.setCoords(x, y)
    }
  }

  handleMouseMove(evt: MouseEvent) {
    if (evt.buttons === 1) {
      if (this.shadowRoot.getSelection().toString().length > 0) {
        const caret = this.shadowRoot.querySelector('.caret')
        if (caret) {
          caret.remove()
        }
      }
    }
  }

  handleMouseUp(evt: MouseEvent) {
    const selection = this.shadowRoot.getSelection()

    if (selection.toString().length > 0) {
    }
  }

  handleKeyDown(evt: KeyboardEvent): void {
    const inputHandler = <InputHandler>this.parentNode.parentNode.lastElementChild
    if (!['Control', 'Alt', 'Meta', 'CapsLock', 'Shift'].includes(evt.key)) {
      if (!(window.api.os() === 'darwin' ? evt.metaKey : evt.ctrlKey)) {
        inputHandler.focus()
      }
      inputHandler.handleKeyDown(evt)
    }
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      cursor: text;
      outline: none;
      white-space: nowrap;
    }

    .line {
      display: flex;
      min-height: var(--line-height);
      padding-left: 0.5em;
      color: #000d;
    }

    .line[appFocused] {
      background-color: #0001;
      box-shadow: inset 0 0 1px #0004;
      color: #000e;
      font-weight: 450;
    }

    .chunk {
      position: relative;
      z-index: 1;
      white-space: pre;

      /* box-shadow: 0 0 1px black; */
    }

    .caret {
      position: absolute;
      z-index: 0;
      width: 3px;
      animation: blink 1s step-end infinite;
      background: #0008;
      pointer-events: none;
      white-space: pre;
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
  `
}
