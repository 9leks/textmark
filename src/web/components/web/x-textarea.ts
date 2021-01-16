import { css, html, internalProperty, LitElement, property, TemplateResult } from 'lit-element'
import { getCharacterWidth, setCaret } from './carethandler'
import { handleInput, handleKeyDown } from './inputhandler'
import { handleMouseDown, handleMouseMove, handleMouseUp, handleClick } from './mousehandler'

export default class XTextArea extends LitElement {
  protected readonly maxChunkSize = 30

  @internalProperty()
  protected lines: string[]

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

  getCharacterWidth: () => number
  setCaret: (x: number, y: number) => void
  handleKeyDown: (e: KeyboardEvent) => void
  handleInput: (e: InputEvent) => void
  handleMouseDown: (e: MouseEvent) => void
  handleMouseMove: (e: MouseEvent) => void
  handleMouseUp: (e: MouseEvent) => void
  handleClick: (e: MouseEvent) => void

  constructor() {
    super()
    this.getCharacterWidth = getCharacterWidth.bind(this)
    this.setCaret = setCaret.bind(this)
    this.handleKeyDown = handleKeyDown.bind(this)
    this.handleInput = handleInput.bind(this)
    this.handleMouseDown = handleMouseDown.bind(this)
    this.handleMouseMove = handleMouseMove.bind(this)
    this.handleMouseUp = handleMouseUp.bind(this)
    this.handleClick = handleClick.bind(this)
  }

  connectedCallback(): void {
    super.connectedCallback()
    this.tabIndex = -1
    this.lines = this.value.split('\n')
    this.style.fontSize = this.fontSize
    this.style.fontFamily = this.fontFamily
    this.style.lineHeight = this.lineHeight
  }

  disconnectedCallback(): void {
    document.removeEventListener('mouseup', this.handleMouseUp)
    super.disconnectedCallback()
  }

  firstUpdated(): void {
    const lines = this.shadowRoot.querySelector('#lines')
    const numberline = this.shadowRoot.querySelector('#numberline')

    document.addEventListener('mouseup', (e: MouseEvent) => this.handleMouseUp(e))
    lines.addEventListener('scroll', (e: Event) => this.handleScroll(e))
    numberline.addEventListener('wheel', (e: Event) => this.handleScroll(e))
    this.addEventListener('mousedown', this.handleMouseDown)
    this.addEventListener('mousemove', this.handleMouseMove)
    this.addEventListener('keydown', this.handleKeyDown)
    this.addEventListener('input', this.handleInput)
    this.addEventListener('click', this.handleClick)
  }

  updated(props: Map<string, string | string[] | number>): void {
    this.setCaret(this.x, this.y)

    if (['lines', 'y', 'x'].some((prop) => props.has(prop))) {
      this.sendChangeEvent()
    }
  }

  render(): TemplateResult {
    const { lines, maxChunkSize, y } = this

    return html`
      <div id="numberline">
        ${lines.map((_, y: number) => html`<div class="line-number" ?app-focused=${y === y}>${y}</div>`)}
      </div>
      <div id="lines">
        ${lines.map((line, y) => {
          const matcher = `(\\w{1,${maxChunkSize}}|\\s{1,${maxChunkSize}}|\\p{P}{1,${maxChunkSize}})`
          const chunks = line.match(new RegExp(matcher, 'gu'))
          const offsets = chunks?.reduce((acc, val, i) => [...acc, val.length + acc[i]], [0]) || []

          return html`
            <div class="line" .app-offset-y=${y} ?app-focused=${y === y}>
              ${chunks?.map((chunk, i) => {
                return html`<span class="chunk" .app-offset-x=${offsets[i]}>${chunk}</span>`
              }) || html`<br />`}
            </div>
          `
        })}
      </div>
      <textarea id="inputhandler" autofocus></textarea>
    `
  }

  sendChangeEvent(): void {
    this.dispatchEvent(
      new CustomEvent('on-change', {
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

  handleScroll(e: Event): void {
    const el = e.target as HTMLDivElement
    const other = this.shadowRoot.querySelector<HTMLDivElement>(el.id === 'lines' ? '#numberline' : '#lines')
    console.log(el, other)
    other.scrollTop = el.scrollTop
  }

  static styles = css`
    ::selection {
      background: rgba(190, 220, 240, 0.99);
    }

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
      box-shadow: 0 0 1px black;
      white-space: pre;
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
