import { css, html, internalProperty, LitElement, property } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import { isLine } from './@types/helpers'
import { handleKeyDown } from './keyhandler'

export default class XTextArea extends LitElement {
  @internalProperty() protected lines: string[] = []
  @internalProperty() private lineWidth: string = '0ch'
  @property() value = 'Hello, world!'
  @property({ attribute: 'font-size' }) fontSize = '16px'
  @property({ attribute: 'font-family' }) fontFamily = '"SF Mono", "Courier New", monospace'
  @property({ attribute: 'line-height' }) lineHeight = '28px'
  @property({ type: Number }) x = 0
  @property({ type: Number }) y = 0

  handleKeyDown: (e: KeyboardEvent) => void

  firstUpdated() {
    this.handleKeyDown = handleKeyDown.bind(this)
    this.lines = this.value.split('\n')
    this.shadowRoot.addEventListener('scroll', (e: Event) => this.handleScroll(e), true)
    this.shadowRoot.addEventListener('mousedown', (e: MouseEvent) => this.handleMouseDown(e))
    document.addEventListener('keydown', this.handleKeyDown)

    const inputHandler = this.shadowRoot.querySelector<HTMLTextAreaElement>('.input')
    inputHandler.addEventListener('input', (e: InputEvent) => this.handleInput(e))
    inputHandler.focus({ preventScroll: true })
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeyDown)
    super.disconnectedCallback()
  }

  updated(props: Map<string, string | string[] | number>) {
    this.lineWidth = `${this.lines.reduce((line, curr) => Math.max(line, curr.length), 0)}ch`
    this.shadowRoot.querySelector<HTMLSpanElement>('.caret')?.remove()

    const { x, y } = this
    const caret = document.createElement('span')
    const parent = this.shadowRoot.querySelector<HTMLDivElement>('.document')
    const height = Number(this.lineHeight.substring(0, 2))

    caret.className = 'caret'
    caret.style.left = `${x + 0.9}ch`
    caret.style.top = `${y * height}px`
    parent.appendChild(caret)

    if (['lines', 'y', 'x'].some((prop) => props.has(prop))) {
      this.sendChangeEvent()
    }
  }

  sendChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent('on-change', {
        detail: { value: this.lines.join('\n'), x: this.x, y: this.y },
        composed: true,
        bubbles: true,
      })
    )
  }

  handleScroll(e: Event) {
    const el = e.target as HTMLDivElement
    const className = el.classList.contains('numberline') ? '.document' : '.numberline'
    const other = this.shadowRoot.querySelector<HTMLDivElement>(className)
    other.scrollTop = el.scrollTop
  }

  handleMouseDown(e: MouseEvent) {
    const line = e.target as HTMLDivElement

    if (isLine(line)) {
      const lineWidth = line.children[0].clientWidth
      const textLength = line.innerText.length
      const zeroWidth = 10
      const ch = lineWidth / textLength
      const offset = Math.max(Math.round(((e.offsetX * ch) / ch - zeroWidth) / ch) || -1, 0)
      this.x = Math.min(offset, textLength)
      this.y = line.posY
    }
  }

  handleInput(this: XTextArea, _e: InputEvent): void {
    // TODO: handle composed characters
    const inputHandler = this.shadowRoot.querySelector<HTMLTextAreaElement>('.input')
    const input = inputHandler.value
    if (input.includes('\n')) {
      return
    }

    inputHandler.value = ''
    const { x, y, lines } = this
    this.lines = [...lines.slice(0, y), lines[y].slice(0, x) + input + lines[y].slice(x), ...lines.slice(y + 1)]
    this.x = this.x + 1
  }

  render() {
    const { y, lines, fontSize, fontFamily, lineHeight, lineWidth } = this

    return html`
      <div class="numberline">
        ${repeat(lines, (_, y) => {
          return html`
            <div class="line">
              <span>${y + 1}</span>
            </div>
          `
        })}
      </div>

      <div class="document">
        ${repeat(lines, (line, y) => {
          return html`
            <div class="line" .posY=${y}>
              <span>${line}</span>
            </div>
          `
        })}

        <textarea class="input"></textarea>
      </div>

      <style>
        :host {
          font-size: ${fontSize};
          font-family: ${fontFamily};
        }

        .line {
          min-height: ${lineHeight};
        }

        .document .line {
          width: ${lineWidth};
        }

        .document .line:nth-of-type(${y + 1}) {
          background: #0001;
        }

        .numberline .line:nth-of-type(${y + 1}) {
          font-weight: 500;
        }

        .caret {
          min-width: calc(${fontSize} / 5);
          height: ${lineHeight};
        }
      </style>
    `
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        flex: 1;
        flex-direction: row;
        overflow-y: hidden;
      }

      .numberline {
        z-index: -1;
        min-width: 3ch;
        padding-right: 1ch;
        padding-bottom: 0.75rem;
        padding-left: 3ch;
        overflow-y: scroll;
        font-size: 0.75em;
        direction: rtl;
        box-shadow: 1px 1px 5px #0002;
        user-select: none;
        overscroll-behavior: none;
      }

      .document {
        position: relative;
        z-index: 0;
        overflow: auto;
        white-space: nowrap;
        overscroll-behavior: none;
      }

      .document .line {
        padding-left: 1ch;
        cursor: text;
      }

      .line {
        display: flex;
        align-items: center;
      }

      .line span {
        white-space: pre;
        pointer-events: none;
      }

      .caret {
        position: absolute;
        z-index: -1;
        background: #aaa;
        animation: blink 1s step-end infinite;
      }

      @keyframes blink {
        50% {
          opacity: 0;
        }
      }

      .input {
        position: fixed;
        top: -1px;
        left: -1px;
        width: 0;
        height: 0;
        border: none;
        outline: none;
        resize: none;
      }

      /* ========== SCROLLBARS ========== */

      .numberline::-webkit-scrollbar {
        display: none;
      }

      .document::-webkit-scrollbar {
        width: 0.75em;
        height: 0.75em;
        background: transparent;
      }

      .document::-webkit-scrollbar-thumb {
        background: #ddd;
      }

      .document::-webkit-scrollbar-thumb:hover {
        background: #aaa;
      }
    `
  }
}
