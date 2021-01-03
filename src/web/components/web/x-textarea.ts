import { css, html, internalProperty, LitElement, property, TemplateResult } from 'lit-element'

interface LineElement extends HTMLDivElement {
  'app-offset-y': number
  focused: number
}

interface ChunkElement extends HTMLSpanElement {
  'app-offset-chunk': number
  parentElement: LineElement
}

type TextAreaElement = LineElement | ChunkElement

export function isLine(line: TextAreaElement): line is LineElement {
  return (line as LineElement)['app-offset-y'] !== undefined
}

export function isChunk(chunk: TextAreaElement): chunk is ChunkElement {
  return (chunk as ChunkElement)['app-offset-chunk'] !== undefined
}

export default class XTextArea extends LitElement {
  private readonly chunkSize = 30

  @internalProperty()
  private lines: string[]

  @property({ type: String })
  value = 'Hello, world!'

  @property({ type: String, attribute: 'font-size' })
  fontSize = '16px'

  @property({ type: String, attribute: 'font-family' })
  fontFamily = '"SF Mono", "Courier New", monospace'

  @property({ type: String, attribute: 'line-height' })
  lineHeight = '28px'

  @property({ type: Number })
  x = 0

  @property({ type: Number })
  y = 0

  connectedCallback(): void {
    super.connectedCallback()
    this.tabIndex = -1
    this.lines = this.value.split('\n')
    this.style.fontSize = this.fontSize
    this.style.fontFamily = this.fontFamily
    this.style.lineHeight = this.lineHeight
  }

  firstUpdated(): void {
    this.shadowRoot.querySelector('#lines').addEventListener('scroll', (e: Event) => this.handleScroll(e))
    this.addEventListener('mouseup', (e: MouseEvent) => this.handleMouseUp(e))
    this.addEventListener('mousedown', this.handleMouseDown)
    this.addEventListener('mousemove', this.handleMouseMove)
    this.addEventListener('keydown', this.handleKeyDown)
    this.addEventListener('input', this.handleInput)
  }

  updated(props: Map<string, string | string[] | number>): void {
    this.setCaret(this.x, this.y)

    if (['lines', 'y', 'x'].some((prop) => props.has(prop))) {
      this.sendInputEvent()
    }
  }

  render(): TemplateResult {
    return html`
      <div id="numberline">
        ${this.lines.map((_, y: number) => html`<div class="line-number" ?app-focused=${y === this.y}>${y}</div>`)}
      </div>
      <div id="lines">
        ${this.lines.map((line, y) => {
          const chunks = line.match(new RegExp(`.{1,${this.chunkSize}}`, 'g'))
          return html`
            <div class="line" .app-offset-y=${y} ?app-focused=${y === this.y}>
              ${chunks?.map((chunk, chunkOffset) => {
                return html`<span class="chunk" .app-offset-chunk=${chunkOffset}>${chunk}</span>`
              }) ?? html`<br />`}
            </div>
          `
        })}
      </div>
      <textarea id="inputhandler" autofocus></textarea>
    `
  }

  sendInputEvent(): void {
    this.dispatchEvent(
      new CustomEvent('on-input', {
        detail: {
          value: this.lines.join('\n'),
          x: this.x,
          y: this.y,
        },
        composed: true,
        bubbles: true,
      })
    )
  }

  getCharacterWidth(): number {
    const fontSize = Number(this.fontSize.slice(0, -2))
    const letterSpacing = 1
    return letterSpacing + 0.5 * fontSize + letterSpacing
  }

  setCaret(x: number, y: number): void {
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

    const caret = document.createElement('span')
    const left = this.getCharacterWidth() * (x % this.chunkSize)
    caret.id = 'caret'
    caret.innerText = '\u00a0'
    caret.style.left = `${left - 3}px`

    const line = this.shadowRoot.querySelector('#lines').children[y]
    const chunkN = Math.floor(x / this.chunkSize)

    if (line.children[chunkN] instanceof HTMLBRElement) {
      line.children[chunkN].remove()
    }

    if (line.children[chunkN] === undefined) {
      const chunk = document.createElement('span') as ChunkElement
      chunk.className = 'chunk'
      chunk.style.height = this.lineHeight
      chunk['app-offset-chunk'] = chunkN
      line.append(chunk)
    }

    const chunk = line.children[chunkN]
    chunk.append(caret)
  }

  handleMouseDown(e: MouseEvent): void {
    const el = e.composedPath()[0] as TextAreaElement
    const charWidth = this.getCharacterWidth()
    const leftOffset = Math.max(0, e.pageX - el.getBoundingClientRect().left)

    if (isLine(el)) {
      this.x = leftOffset < charWidth ? 0 : this.lines[el['app-offset-y']].length
      this.y = el['app-offset-y']
    } else if (isChunk(el)) {
      const charOffset = (charWidth / 2 < leftOffset ? Math.ceil : Math.floor)(leftOffset / charWidth)
      this.x = el['app-offset-chunk'] * this.chunkSize + charOffset
      this.y = el.parentElement['app-offset-y']
    }
  }

  handleMouseMove(e: MouseEvent): void {
    if (e.buttons === 1 && this.shadowRoot.getSelection().toString().length > 0) {
      const caret = this.shadowRoot.querySelector<HTMLSpanElement>('#caret')
      if (caret !== null) {
        caret.remove()
      }
    }
  }

  handleMouseUp(_e: MouseEvent): void {
    const selection = this.shadowRoot.getSelection()

    if (selection.toString().length > 0) {
    }
  }

  handleInput(_e: InputEvent): void {
    const inputHandler = this.shadowRoot.querySelector<HTMLTextAreaElement>('#inputhandler')
    const input = inputHandler.value
    inputHandler.value = ''

    if (input.includes('\n')) {
      return
    }

    const { x, y, lines } = this
    this.lines = [...lines.slice(0, y), lines[y].slice(0, x) + input + lines[y].slice(x), ...lines.slice(y + 1)]
    this.x = this.x + 1
  }

  handleScroll(e: Event): void {
    const lines = e.target as HTMLDivElement
    const numberline = this.shadowRoot.querySelector<HTMLDivElement>('#numberline')
    numberline.scrollTop = lines.scrollTop
  }

  handleKeyDown(e: KeyboardEvent): void {
    if (['Control', 'Alt', 'Meta', 'CapsLock', 'Shift'].includes(e.key)) {
      return
    }

    if (!(window.api.os() === 'darwin' ? e.metaKey : e.ctrlKey)) {
      const textArea = this.shadowRoot.querySelector<HTMLTextAreaElement>('#inputhandler')
      textArea.focus()
    }

    const { x, y, lines } = this

    switch (e.key) {
      case 'Enter': {
        if (x === 0) {
          this.y = y + 1
          this.lines = [...lines.slice(0, y), '', ...lines.slice(y)]
          break
        }

        if (x === lines[y].length) {
          this.x = 0
          this.y = y + 1
          this.lines = [...lines.slice(0, y + 1), '', ...lines.slice(y + 1)]
          break
        }

        this.x = 0
        this.y = y + 1
        this.lines = [...lines.slice(0, y), lines[y].slice(0, x), lines[y].slice(x), ...lines.slice(y + 1)]
        break
      }
      case 'Backspace': {
        if (x === 0) {
          if (y === 0) {
            break
          }

          this.x = lines[y - 1].length
          this.y = y - 1
          this.lines = [...lines.slice(0, y - 1), lines[y - 1] + lines[y], ...lines.slice(y + 1)]
          break
        }

        this.x = x - 1
        this.lines = [...lines.slice(0, y), lines[y].slice(0, x - 1) + lines[y].slice(x), ...lines.slice(y + 1)]
        break
      }
      case 'Delete': {
        if (y === lines.length - 1 && x === lines[y].length) {
          break
        }

        if (x === lines[y].length) {
          this.lines = [...lines.slice(0, y), lines[y] + lines[y + 1], ...lines.slice(y + 2)]
          break
        }

        this.lines = [...lines.slice(0, y), lines[y].substring(0, x) + lines[y].substring(x + 1), ...lines.slice(y + 1)]
        break
      }
      case 'Home': {
        this.x = 0
        break
      }
      case 'End': {
        this.x = lines[y].length
        break
      }
      case 'PageUp': {
        this.x = 0
        this.y = 0
        break
      }
      case 'PageDown': {
        this.x = lines[lines.length - 1].length
        this.y = lines.length - 1
        break
      }
      case 'ArrowLeft': {
        if (x === 0) {
          if (y === 0) {
            break
          }
          this.x = lines[y - 1].length
          this.y = y - 1
          break
        } else if (e.altKey || e.ctrlKey) {
          this.x = lines[y].lastIndexOf(' ', x - 2) + 1
          break
        }
        this.x = x - 1
        break
      }
      case 'ArrowRight': {
        if (x === lines[y].length) {
          if (y === lines.length - 1) {
            break
          }
          this.x = 0
          this.y = y + 1
          break
        } else if (e.altKey || e.ctrlKey) {
          const index = lines[y].indexOf(' ', x) + 1
          if (index > 0) {
            this.x = index
          } else {
            this.x = lines[y].length
          }
          break
        }
        this.x = x + 1
        break
      }
      case 'ArrowUp': {
        if (y === 0) {
          break
        }

        if (e.altKey || e.ctrlKey) {
          this.y = y - 1
          this.lines = [...lines.slice(0, y - 1), lines[y], lines[y - 1], ...lines.slice(y + 1)]
          break
        }

        this.x = lines[y - 1].length >= x ? x : lines[y - 1].length
        this.y = y - 1
        break
      }
      case 'ArrowDown': {
        if (y === lines.length - 1) {
          break
        }

        if (e.altKey || e.ctrlKey) {
          this.y = y + 1
          this.lines = [...lines.slice(0, y), lines[y + 1], lines[y], ...lines.slice(y + 2)]
        }

        this.x = lines[y + 1].length >= x ? x : lines[y + 1].length
        this.y = y + 1
        break
      }
    }
  }

  static styles = css`
    :host {
      display: flex;
      overflow: hidden;
      width: 100%;
      height: 100%;
      cursor: text;
      outline: none;
      white-space: nowrap;
    }

    #numberline {
      position: relative;
      min-width: 6ch;
      height: auto;
      box-shadow: 1px 0 3px -1px #0002;
      color: #888;
      direction: rtl;
      overflow-y: auto;
      pointer-events: none;
      user-select: none;
    }

    #numberline::-webkit-scrollbar {
      display: none;
    }

    .line-number {
      padding-right: 1.5ch;
      font-size: 0.9em;
    }

    .line-number[app-focused] {
      color: #000000ea;
      font-weight: 450;
    }

    #lines {
      overflow: overlay;
      width: 100%;
      height: 100%;
      overscroll-behavior-y: none;
    }

    #lines::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }

    #lines::-webkit-scrollbar-thumb {
      background-color: #0003;
    }

    #lines::-webkit-scrollbar-thumb:hover {
      background-color: #0006;
    }

    #lines::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    .line {
      display: flex;
      padding-left: 0.5em;
      color: #000d;
    }

    .line[app-focused] {
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

    #caret {
      position: absolute;
      z-index: 0;
      width: 3px;
      animation: blink 1s step-end infinite;
      background: #0008;
      pointer-events: none;
      white-space: pre;
    }

    #inputhandler {
      position: fixed;
      width: 0;
      height: 0;
      padding: 0;
      opacity: 0;
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
  `
}
