import { css, html, internalProperty, LitElement, property } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import { isLine } from './@types/helpers'
import { handleKeyDown } from './keyhandler'

export default class XTextArea extends LitElement {
  @internalProperty() protected lines: string[] = []
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
    document.addEventListener('mousemove', (e: MouseEvent) => this.handleMouseMove(e))
    document.addEventListener('keydown', this.handleKeyDown)

    const inputHandler = this.shadowRoot.querySelector<HTMLTextAreaElement>('.input')
    inputHandler.addEventListener('input', (e: InputEvent) => this.handleInput(e))
    inputHandler.focus({ preventScroll: true })
  }

  disconnectedCallback() {
    document.removeEventListener('mousemove', (e: MouseEvent) => this.handleMouseMove(e))
    document.removeEventListener('keydown', this.handleKeyDown)
    super.disconnectedCallback()
  }

  updated(props: Map<string, string | string[] | number>) {
    this.shadowRoot.querySelector<HTMLSpanElement>('.caret')?.remove()

    const { x, y } = this
    const caret = document.createElement('span')
    const textarea = this.shadowRoot.querySelector<HTMLDivElement>('.textarea')
    const height = Number(this.lineHeight.substring(0, 2))

    caret.className = 'caret'
    caret.style.left = `${x + 0.9}ch`
    caret.style.top = `${y * height}px`
    textarea.appendChild(caret)

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
    const className = el.classList.contains('numberline') ? '.textarea' : '.numberline'
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

  handleMouseMove(e: MouseEvent) {
    const selection = this.shadowRoot.getSelection()

    if (e.buttons !== 1 || !selection.toString()) {
      return
    }

    const line = this.shadowRoot.elementFromPoint(e.clientX, e.clientY)
    if (isLine(line)) {
      this.x = selection.focusOffset
      this.y = line.posY
      return
    }

    if (e.target instanceof HTMLHtmlElement || e.target instanceof XTextArea) {
      const height = Number(this.lineHeight.substring(0, 2))
      const width = e.target.getBoundingClientRect().width
      const y = Math.floor(e.clientY / height)

      this.y = Math.max(Math.min(y, this.lines.length - 1), 0)
      this.x = y > this.lines.length - 1 || e.clientX > width ? this.lines[this.y].length : 0
    }
  }

  handleInput(_e: InputEvent): void {
    // TODO: handle composed characters
    const inputHandler = this.shadowRoot.querySelector<HTMLTextAreaElement>('.input')
    const input = inputHandler.value
    if (input.includes('\n')) {
      return
    }

    inputHandler.value = ''
    const { x, y, lines } = this
    this.lines = [...lines.slice(0, y), lines[y].slice(0, x) + input + lines[y].slice(x), ...lines.slice(y + 1)]
    this.x = x + 1
  }

  render() {
    const { y, lines, fontSize, fontFamily, lineHeight } = this

    return html`
      <div class="numberline">
        ${repeat(lines, (_, y) => {
          return html`
            <div class="line" .posY=${y}>
              <span>${y + 1}</span>
            </div>
          `
        })}
      </div>

      <div class="textarea">
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

        .textarea {
          grid-auto-rows: ${lineHeight};
        }

        .textarea .line:nth-of-type(${y + 1}) {
          background-color: #0001;
        }

        .numberline .line {
          height: ${lineHeight};
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
        overflow: hidden;
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

      .textarea {
        position: relative;
        z-index: 0;
        display: grid;
        width: 100%;
        overflow: auto;
        white-space: nowrap;
        cursor: text;
        overscroll-behavior: none;
      }

      .textarea .line span {
        padding-left: 1ch;
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
        background-color: #ff647e9f;
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

      .textarea::-webkit-scrollbar {
        width: 0.75em;
        height: 0.75em;
        background-color: transparent;
      }

      .textarea::-webkit-scrollbar-thumb {
        background-color: #ddd;
      }

      .textarea::-webkit-scrollbar-thumb:hover {
        background-color: #aaa;
      }
    `
  }
}
