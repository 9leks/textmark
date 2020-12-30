import { MobxReactionUpdate } from "@adobe/lit-mobx"
import { css, html, LitElement, TemplateResult } from "lit-element"
import store from "../../store"

export default class InputHandler extends MobxReactionUpdate(LitElement) {
  static tag = "app-input-handler"

  focus(): void {
    const inputHandler = <HTMLTextAreaElement>this.shadowRoot.querySelector(".inputhandler")
    inputHandler.focus()
  }

  handleInput(evt: InputEvent): void {
    const target = <HTMLTextAreaElement>evt.target
    const char = target.value
    target.value = ""

    if (char.includes("\n")) {
      return
    }

    const { x, y, lines } = store
    store.setLines([...lines.slice(0, y), lines[y].slice(0, x) + char + lines[y].slice(x), ...lines.slice(y + 1)])
    store.setCoords(x + 1, y)
  }

  handleKeyDown = (evt: KeyboardEvent): void => {
    const { x, y, lines } = store

    switch (evt.key) {
      case "Enter": {
        if (x === 0) {
          store.setCoords(0, y + 1)
          store.setLines([...lines.slice(0, y), "", ...lines.slice(y)])
          break
        }

        if (x === lines[y].length) {
          store.setCoords(0, y + 1)
          store.setLines([...lines.slice(0, y + 1), "", ...lines.slice(y + 1)])
          break
        }

        store.setCoords(0, y + 1)
        store.setLines([...lines.slice(0, y), lines[y].slice(0, x), lines[y].slice(x), ...lines.slice(y + 1)])
        break
      }
      case "Backspace": {
        if (x === 0) {
          if (y === 0) {
            break
          }
          store.setCoords(lines[y - 1].length, y - 1)
          store.setLines([...lines.slice(0, y - 1), lines[y - 1] + lines[y], ...lines.slice(y + 1)])
          break
        }
        store.setCoords(x - 1, y)
        store.setLines([...lines.slice(0, y), lines[y].slice(0, x - 1) + lines[y].slice(x), ...lines.slice(y + 1)])
        break
      }
      case "Delete": {
        if (y === lines.length - 1 && x === lines[y].length) {
          break
        }

        if (x === lines[y].length) {
          store.setLines([...lines.slice(0, y), lines[y] + lines[y + 1], ...lines.slice(y + 2)])
          break
        }

        store.setLines([
          ...lines.slice(0, y),
          lines[y].substring(0, x) + lines[y].substring(x + 1),
          ...lines.slice(y + 1),
        ])
        break
      }
      case "Home": {
        store.setCoords(0, y)
        break
      }
      case "End": {
        store.setCoords(lines[y].length, y)
        break
      }
      case "PageUp": {
        store.setCoords(0, 0)
        break
      }
      case "PageDown": {
        store.setCoords(lines[lines.length - 1].length, lines.length - 1)
        break
      }
      case "ArrowLeft": {
        if (x === 0) {
          if (y === 0) {
            break
          }
          store.setCoords(lines[y - 1].length, y - 1)
          break
        } else if (evt.altKey || evt.ctrlKey) {
          store.setCoords(lines[y].lastIndexOf(" ", x - 2) + 1, y)
          break
        }
        store.setCoords(x - 1, y)
        break
      }
      case "ArrowRight": {
        if (x === lines[y].length) {
          if (y === lines.length - 1) {
            break
          }
          store.setCoords(0, y + 1)
          break
        } else if (evt.altKey || evt.ctrlKey) {
          const index = lines[y].indexOf(" ", x) + 1
          if (index > 0) {
            store.setCoords(index, y)
          } else {
            store.setCoords(lines[y].length, y)
          }
          break
        }
        store.setCoords(x + 1, y)
        break
      }
      case "ArrowUp": {
        if (y === 0) {
          break
        }

        if (evt.altKey || evt.ctrlKey) {
          store.setCoords(x, y - 1)
          store.setLines([...lines.slice(0, y - 1), lines[y], lines[y - 1], ...lines.slice(y + 1)])
          break
        }

        store.setCoords(lines[y - 1].length >= x ? x : lines[y - 1].length, y - 1)
        break
      }
      case "ArrowDown": {
        if (y === lines.length - 1) {
          break
        }

        if (evt.altKey || evt.ctrlKey) {
          store.setCoords(x, y + 1)
          store.setLines([...lines.slice(0, y), lines[y + 1], lines[y], ...lines.slice(y + 2)])
        }

        store.setCoords(lines[y + 1].length >= x ? x : lines[y + 1].length, y + 1)
        break
      }
    }
  }

  render(): TemplateResult {
    return html`<textarea
      class="inputhandler"
      autofocus
      @input=${this.handleInput}
      @keydown=${this.handleKeyDown}
    ></textarea>`
  }

  static styles = css`
    .inputhandler {
      position: fixed;
      width: 0;
      height: 0;
      padding: 0;
    }
  `
}
