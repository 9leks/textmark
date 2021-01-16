import { css, html, internalProperty, LitElement, property } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'

export default class XTextArea extends LitElement {
  @internalProperty() private lines: string[] = []
  @property() value = 'Hello, world!'
  @property({ attribute: 'font-size' }) fontSize = '16px'
  @property({ attribute: 'font-family' }) fontFamily = '"SF Mono", "Courier New", monospace'
  @property({ attribute: 'line-height' }) lineHeight = '28px'
  @property({ type: Number }) x = 0
  @property({ type: Number }) y = 0

  firstUpdated() {
    this.lines = this.value.split('\n')
    this.shadowRoot.addEventListener('scroll', (e: Event) => this.handleScroll(e), true)
  }

  handleScroll(e: Event) {
    const el = e.target as HTMLDivElement
    const className = el.classList.contains('numberline') ? '.document' : '.numberline'
    const other = this.shadowRoot.querySelector<HTMLDivElement>(className)
    other.scrollTop = el.scrollTop
  }

  render() {
    const { y, lines, fontSize, fontFamily, lineHeight } = this

    return html`
      <div class="numberline">
        ${repeat(lines, (_, y) => {
          return html`
            <div class="line">
              <span>${y}</span>
            </div>
          `
        })}
      </div>

      <div class="document">
        ${repeat(lines, (line, y) => {
          return html`
            <div class="line">
              <span>${line}</span>
            </div>
          `
        })}
      </div>

      <style>
        :host {
          font-size: ${fontSize};
          font-family: ${fontFamily};
        }

        .line {
          min-height: ${lineHeight};
        }

        .document .line:nth-of-type(${y + 1}) {
          background: #0001;
        }

        .numberline .line:nth-of-type(${y + 1}) {
          font-weight: 500;
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
        min-width: 3ch;
        padding-right: 1ch;
        padding-bottom: 0.75rem;
        padding-left: 3ch;
        overflow-y: scroll;
        font-size: 0.75em;
        direction: rtl;
        box-shadow: 1px 1px 5px #0002;
        overscroll-behavior: none;
      }

      .document {
        overflow: auto;
        white-space: nowrap;
        overscroll-behavior: none;
      }

      .document .line {
        padding-left: 1ch;
      }

      .line {
        display: flex;
        align-items: center;
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
        background: #ccc;
      }

      .document::-webkit-scrollbar-thumb:hover {
        background: #aaa;
      }
    `
  }
}
