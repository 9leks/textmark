import { MobxReactionUpdate } from "@adobe/lit-mobx"
import { css, html, LitElement, TemplateResult } from "lit-element"
import * as store from "../store"

export default class AppInputHandler extends MobxReactionUpdate(LitElement) {
  static tag = "app-input-handler"

  focus(): void {
    const inputHandler = <HTMLTextAreaElement>this.shadowRoot.querySelector(".input-handler")
    inputHandler.focus()
  }

  handleInput(evt: InputEvent): void {
    const target = <HTMLTextAreaElement>evt.target
    const input = target.value
    target.value = ""

    if (input.includes("\n")) {
      return
    }

    const { x, y } = store.cursor
    store.text.insertAt(input, y, x)
    store.cursor.set(x + 1, y)
  }

  handleKeyDown = (evt: KeyboardEvent): void => {
    const { x, y } = store.cursor
    const { lines } = store.text

    switch (evt.key) {
      case "Enter": {
        if (x === 0) {
          store.cursor.set(0, y + 1)
          store.text.set([...lines.slice(0, y), "", ...lines.slice(y)])
          break
        }

        if (x === lines[y].length) {
          store.cursor.set(0, y + 1)
          store.text.set([...lines.slice(0, y + 1), "", ...lines.slice(y + 1)])
          break
        }

        store.cursor.set(0, y + 1)
        store.text.set([...lines.slice(0, y), lines[y].slice(0, x), lines[y].slice(x), ...lines.slice(y + 1)])
        break
      }
      case "Backspace": {
        if (x === 0) {
          if (y === 0) {
            break
          }
          store.cursor.set(lines[y - 1].length, y - 1)
          store.text.set([...lines.slice(0, y - 1), lines[y - 1] + lines[y], ...lines.slice(y + 1)])
          break
        }
        store.cursor.set(x - 1, y)
        store.text.set([...lines.slice(0, y), lines[y].slice(0, x - 1) + lines[y].slice(x), ...lines.slice(y + 1)])
        break
      }
      case "Delete": {
        if (y === lines.length - 1 && x === lines[y].length) {
          break
        }

        if (x === lines[y].length) {
          store.text.set([...lines.slice(0, y), lines[y] + lines[y + 1], ...lines.slice(y + 2)])
          break
        }

        store.text.set([
          ...lines.slice(0, y),
          lines[y].substring(0, x) + lines[y].substring(x + 1),
          ...lines.slice(y + 1),
        ])
        break
      }
      case "Home": {
        store.cursor.set(0, y)
        break
      }
      case "End": {
        store.cursor.set(lines[y].length, y)
        break
      }
      case "PageUp": {
        store.cursor.set(0, 0)
        break
      }
      case "PageDown": {
        store.cursor.set(lines[lines.length - 1].length, lines.length - 1)
        break
      }
      case "ArrowLeft": {
        if (x === 0) {
          if (y === 0) {
            break
          }
          store.cursor.set(lines[y - 1].length, y - 1)
          break
        } else if (evt.altKey || evt.ctrlKey) {
          store.cursor.set(lines[y].lastIndexOf(" ", x - 2) + 1, y)
          break
        }
        store.cursor.set(x - 1, y)
        break
      }
      case "ArrowRight": {
        if (x === lines[y].length) {
          if (y === lines.length - 1) {
            break
          }
          store.cursor.set(0, y + 1)
          break
        } else if (evt.altKey || evt.ctrlKey) {
          const index = lines[y].indexOf(" ", x) + 1
          if (index > 0) {
            store.cursor.set(index, y)
          } else {
            store.cursor.set(lines[y].length, y)
          }
          break
        }
        store.cursor.set(x + 1, y)
        break
      }
      case "ArrowUp": {
        if (y === 0) {
          break
        }

        if (evt.altKey || evt.ctrlKey) {
          store.cursor.set(x, y - 1)
          store.text.set([...lines.slice(0, y - 1), lines[y], lines[y - 1], ...lines.slice(y + 1)])
          break
        }

        store.cursor.set(lines[y - 1].length >= x ? x : lines[y - 1].length, y - 1)
        break
      }
      case "ArrowDown": {
        if (y === lines.length - 1) {
          break
        }

        if (evt.altKey || evt.ctrlKey) {
          store.cursor.set(x, y + 1)
          store.text.set([...lines.slice(0, y), lines[y + 1], lines[y], ...lines.slice(y + 2)])
        }

        store.cursor.set(lines[y + 1].length >= x ? x : lines[y + 1].length, y + 1)
        break
      }
    }
  }

  render(): TemplateResult {
    return html`<textarea
      class="input-handler"
      autofocus
      @input=${this.handleInput}
      @keydown=${this.handleKeyDown}
    ></textarea>`
  }

  static styles = css`
    .input-handler {
      position: fixed;
      width: 0;
      height: 0;
      padding: 0;
    }
  `
}
