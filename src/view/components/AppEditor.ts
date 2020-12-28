import { MobxReactionUpdate } from "@adobe/lit-mobx"
import { css, html, LitElement, TemplateResult } from "lit-element"
import { querySelectorDeep } from "query-selector-shadow-dom"
import * as store from "../store"
import AppInputHandler from "./AppInputHandler"

export default class AppEditor extends MobxReactionUpdate(LitElement) {
  static tag = "app-editor"

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
    const inputHandler = <AppInputHandler>querySelectorDeep("app-input-handler")

    if (!["Control", "Alt", "Meta", "CapsLock", "Shift"].includes(evt.key)) {
      if (!(window.api.os() === "darwin" ? evt.metaKey : evt.ctrlKey)) {
        inputHandler.focus()
      }
      inputHandler.handleKeyDown(evt)
    }
  }

  updated() {
    const previous = <HTMLSpanElement>querySelectorDeep("app-editor span.cursor")

    if (previous) {
      previous.remove()
    }

    const caret = document.createElement("span")
    caret.innerText = "|"

    const { lines } = store.text
    const { x, y } = store.cursor

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
    caret.focus()
  }

  render(): TemplateResult {
    return html`
      <div class="lines" tabindex="-1" @keydown=${this.handleKeyDown}>
        ${store.text.lines.map(
          (line: string, lineIndex: number) =>
            html`
              <span data-line="${lineIndex}" @mousedown=${this.handleMouseDown}>
                ${!line
                  ? html`<br />`
                  : [...line].map(
                      (character: string, characterIndex: number) =>
                        html`<span
                          class="character"
                          data-character=${characterIndex}
                          data-active=${characterIndex === store.cursor.x && lineIndex === store.cursor.y}
                          @mousedown=${this.handleMouseDown}
                          >${character}</span
                        >`
                    )}
              </span>
            `
        )}
      </div>
    `
  }

  static styles = css`
    .lines {
      display: grid;
      cursor: text;
      grid-auto-rows: 1fr;
      outline: none;
      white-space: nowrap;
    }

    .character {
      position: relative;
      z-index: 1;
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
    }

    .cursor.boundary {
      margin-left: -0.5ch;
    }
  `
}
