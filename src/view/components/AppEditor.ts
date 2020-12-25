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
      const x = store.text.lines[y].length > 0 ? store.text.lines[y].length - 1 : 0
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
    inputHandler.focus()
    inputHandler.handleKeyDown(evt)
  }

  render(): TemplateResult {
    return html`
      <div class="lines" tabindex="-1" @keydown=${this.handleKeyDown}>
        ${store.text.lines.map(
          (line: string, lineIndex: number) =>
            html`
              <span data-line="${lineIndex}" @mousedown=${this.handleMouseDown}>
                ${[...line].map(
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
      grid-auto-rows: 1fr;
      outline: none;
    }

    .character {
      white-space: pre;
    }

    .character[data-active="true"] {
      animation: blink 1s step-start infinite;
    }

    @keyframes blink {
      50% {
        box-shadow: -2px 0 #555;
      }
    }
  `
}
