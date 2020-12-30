import { MobxReactionUpdate } from "@adobe/lit-mobx"
import { css, html, LitElement, TemplateResult } from "lit-element"
import store from "../../store"

export default class NumberLine extends MobxReactionUpdate(LitElement) {
  render(): TemplateResult {
    return html`
      ${store.lines.map((_, y: number) => {
        const focused = y === store.y
        return html`<div class="line" ?focused=${focused} .y=${y}>${y}</div>`
      })}
    `
  }

  constructor() {
    super()
  }

  static styles = css`
    :host {
      min-width: 6ch;
      flex-direction: column;
      box-shadow: 1px 0 3px -1px #0002;
      pointer-events: none;
    }

    .line {
      padding-right: 1.5ch;
      color: #888;
      direction: rtl;
      font-size: 0.9em;
    }

    .line[focused] {
      color: #000000ea;
      font-weight: var(--focused-font-weight);
    }
  `
}
