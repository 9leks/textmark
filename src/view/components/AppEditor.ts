import { MobxReactionUpdate } from "@adobe/lit-mobx"
import { css, html, LitElement, TemplateResult } from "lit-element"
import { querySelectorDeep } from "query-selector-shadow-dom"
import * as store from "../store"
import AppInputHandler from "./AppInputHandler"

export default class AppEditor extends MobxReactionUpdate(LitElement) {
  static tag = "app-editor"

  updated() {
    const previous = <HTMLSpanElement>querySelectorDeep("app-editor span.cursor")
    if (previous) {
      previous.remove()
    }

    const { lines } = store.text
    const { x, y } = store.cursor
    const caret = document.createElement("span")
    caret.innerText = "|"

    if (lines[y].length === 0 || x === lines[y].length) {
      caret.className = "cursor boundary"
      const selector = `span[data-line="${y}"]`
      const line = <HTMLDivElement>querySelectorDeep(selector)
      if (lines[y].length === 0) {
        line.insertBefore(caret, line.firstChild)
      } else {
        line.appendChild(caret)
      }
    } else {
      caret.className = "cursor"
      const selector = `span[data-line="${y}"] span[data-character="${x}"]`
      const character = <HTMLSpanElement>querySelectorDeep(selector)
      character.parentNode.insertBefore(caret, character.nextSibling)
    }
  }

  // TODO show cursor as it changes during selection
  setCursorAtFocusNode(evt: MouseEvent | KeyboardEvent): void {
    const selection = this.shadowRoot.getSelection()
    if (selection.toString().length > 0) {
      const target = <HTMLSpanElement | HTMLDivElement>evt.target
      const focus = <HTMLSpanElement>selection.focusNode.parentElement
      const backwards = selection.anchorNode !== selection.getRangeAt(0).startContainer

      if (focus.className === "lines" && target.className === "line") {
        const y = Number(target.getAttribute("data-line"))
        store.cursor.set(0, y)
      } else if (focus.className === "line" && backwards) {
        const y = Number(focus.getAttribute("data-line"))
        store.cursor.set(store.text.lines[y].length, y)
      } else if (focus.className === "character") {
        const x = Number(focus.getAttribute("data-character"))
        const y = Number(focus.parentElement.getAttribute("data-line"))
        store.cursor.set(backwards ? x : x + 1, y)
      } else {
        // select downwards from outside window
        const range = selection.getRangeAt(0)
        const start = <HTMLDivElement>range.startContainer
        const end = <HTMLDivElement>range.endContainer
        const node = start.className === "line" ? start : end
        const y = Number(node.getAttribute("data-line"))
        store.cursor.set(0, y)
      }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    // document to catch event outside window. arrow function due to memoization.
    document.addEventListener("mouseup", (evt: MouseEvent) => this.setCursorAtFocusNode(evt))
  }

  handleMouseDown(evt: MouseEvent): void {
    evt.stopPropagation()
    const target = evt.target as HTMLDivElement | HTMLSpanElement

    if (target.hasAttribute("data-line")) {
      const y = Number(target.getAttribute("data-line"))
      const x = store.text.lines[y].length > 0 ? store.text.lines[y].length : 0
      store.cursor.set(x, y)
    }

    if (target.hasAttribute("data-character")) {
      const x = Number(target.getAttribute("data-character"))
      const y = Number(target.parentElement.getAttribute("data-line"))
      store.cursor.set(x, y)
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

  handleMouseOver(evt: MouseEvent) {
    if (evt.buttons === 1) {
      const caret = <HTMLSpanElement>querySelectorDeep("app-editor span.cursor")
      if (caret) {
        caret.remove()
      }
    }
  }

  render(): TemplateResult {
    return html`
      <div class="lines" tabindex="-1" @keydown=${this.handleKeyDown}>
        ${store.text.lines.map(
          (line: string, lineIndex: number) =>
            html` <span
              class="line"
              data-line="${lineIndex}"
              @mousedown=${this.handleMouseDown}
              @mouseover=${this.handleMouseOver}
            >
              ${!line
                ? html`<br
                    class="character"
                    data-character="0"
                    data-active=${0 === store.cursor.x && lineIndex === store.cursor.y}
                    @mousedown=${this.handleMouseDown}
                    @mouseover=${this.handleMouseOver}
                  />`
                : [...line].map(
                    (character: string, characterIndex: number) =>
                      html`<span
                        class="character"
                        data-character=${characterIndex}
                        data-active=${characterIndex === store.cursor.x && lineIndex === store.cursor.y}
                        @mousedown=${this.handleMouseDown}
                        @mouseover=${this.handleMouseOver}
                        >${character}</span
                      >`
                  )}
            </span>`
        )}
      </div>
    `
  }

  static styles = css`
    .lines {
      display: grid;
      padding-right: 1em;
      cursor: text;
      line-height: 1.5em;
      outline: none;
      white-space: nowrap;
    }

    .line {
      position: relative;
      z-index: 0;
    }

    .character {
      white-space: pre;
    }

    @keyframes blink {
      50% {
        opacity: 0;
      }
    }

    .cursor {
      position: absolute;
      z-index: -1;
      margin-top: -0.05em;
      margin-left: -1.5ch;
      animation: blink 1s step-end infinite;
      color: #111;
      font-weight: bold;
      user-select: none;
    }

    .cursor.boundary {
      margin-left: -0.5ch;
    }
  `
}
