import { MobxReactionUpdate } from "@adobe/lit-mobx"
import { css, html, LitElement, TemplateResult } from "lit-element"
import { querySelectorDeep } from "query-selector-shadow-dom"
import * as store from "../store"
import AppInputHandler from "./AppInputHandler"

export default class AppEditor extends MobxReactionUpdate(LitElement) {
  static tag = "app-editor"

  // TODO: make cursor visually follow selection focus node
  // TODO: double click selection
  // TODO: soft wrapping

  setCursorAtFocusNode(evt: MouseEvent | KeyboardEvent): void {
    const selection = this.shadowRoot.getSelection()
    if (selection.toString().length > 0) {
      const target = <HTMLSpanElement | HTMLDivElement>evt.target
      const focus = <HTMLSpanElement>selection.focusNode.parentElement
      const backwards = selection.anchorNode !== selection.getRangeAt(0).startContainer

      if (focus.className === "lines" && target.className === "line") {
        const y = Number(target.dataset.y)
        store.cursor.set(0, y)
      } else if (focus.className === "line" && backwards) {
        const y = Number(focus.dataset.y)
        store.cursor.set(store.text.lines[y].length, y)
      } else if (focus.className === "char") {
        const x = Number(focus.dataset.x)
        const y = Number(focus.parentElement.dataset.y)
        store.cursor.set(backwards ? x : x + 1, y)
      } else {
        // select downwards from outside window
        const range = selection.getRangeAt(0)
        const start = <HTMLDivElement>range.startContainer
        const end = <HTMLDivElement>range.endContainer
        const node = start.className === "line" ? start : end
        const y = Number(node.dataset.y)
        store.cursor.set(0, y)
      }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    // document instead of shadowroot to catch event outside window.
    document.addEventListener("mouseup", (evt: MouseEvent) => {
      this.setCursorAtFocusNode(evt)
    })
  }

  updated() {
    const previous = <HTMLSpanElement>querySelectorDeep("app-editor .caret")
    if (previous) {
      previous.remove()
    }

    const { lines } = store.text
    const { x, y } = store.cursor
    const boundary = lines[y].length === 0 || x === lines[y].length
    const selector = `.line[data-y="${y}"] ${boundary ? "" : `.char[data-x="${x}"]`}`
    const focus = <HTMLSpanElement | HTMLDivElement>querySelectorDeep(selector)
    const caret = document.createElement("span")
    caret.innerText = "\u00a0"
    caret.className = `caret${boundary ? " boundary" : ""}`

    if (lines[y].length === 0) {
      focus.insertBefore(caret, focus.firstChild)
    } else if (x === lines[y].length) {
      focus.appendChild(caret)
    } else {
      focus.parentNode.insertBefore(caret, focus.nextSibling)
    }
  }

  handleMouseDown(evt: MouseEvent): void {
    evt.stopPropagation()
    const target = evt.target as HTMLDivElement | HTMLSpanElement

    if (target.className === "line") {
      const y = Number(target.dataset.y)
      const x = store.text.lines[y].length > 0 ? store.text.lines[y].length : 0
      store.cursor.set(x, y)
    }

    if (target.className === "char") {
      const y = Number(target.parentElement.dataset.y)
      const x = Number(target.dataset.x)
      store.cursor.set(x, y)
    }
  }

  handleMouseOver(evt: MouseEvent) {
    if (evt.buttons === 1) {
      if (this.shadowRoot.getSelection().toString().length > 0) {
        const caret = <HTMLSpanElement>querySelectorDeep("app-editor .caret")
        if (caret) {
          caret.remove()
        }
      }
    }
  }

  handleKeyDown(evt: KeyboardEvent): void {
    this.setCursorAtFocusNode(evt)

    const inputHandler = <AppInputHandler>querySelectorDeep("app-input-handler")
    if (!["Control", "Alt", "Meta", "CapsLock", "Shift"].includes(evt.key)) {
      if (!(window.api.os() === "darwin" ? evt.metaKey : evt.ctrlKey)) {
        inputHandler.focus()
      }
      inputHandler.handleKeyDown(evt)
    }
  }

  render(): TemplateResult {
    return html`
      <div
        class="lines"
        tabindex="-1"
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
        @mouseover=${this.handleMouseOver}
        data-state-x=${store.cursor.x /* for mobx tracking */}
      >
        ${store.text.lines.map((line: string, y: number) => {
          return html`
            <span class="line" active=${y === store.cursor.y} data-y="${y}">
              ${!line
                ? html`<br class="char" data-x="0" />`
                : [...line].map((c: string, x: number) => {
                    return html`<span class="char" data-x=${x}>${c}</span>`
                  })}
            </span>
          `
        })}
      </div>
    `
  }

  static styles = css`
    .lines {
      display: flex;
      flex-direction: column;
      padding-right: 1em;
      cursor: text;
      outline: none;
      white-space: nowrap;
    }

    .line {
      position: relative;
      z-index: 1;
      color: #000d;
    }

    .line[active="true"] {
      background-color: var(--active-bg-color);
      box-shadow:
        inset 0 1px 1px -1px var(--active-box-shadow-color),
        inset 0 -1px 1px -1px var(--active-box-shadow-color);
      color: var-(--active-font-color);
      font-weight: var(--active-font-weight);
    }

    .char {
      white-space: pre;
    }

    .caret {
      position: absolute;
      z-index: 0;
      width: 0.3ch;
      margin-left: -1ch;
      animation: blink 1s step-end infinite;
      background: #0009;
      user-select: none;
    }

    .caret.boundary {
      margin-left: 0;
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }
  `
}
