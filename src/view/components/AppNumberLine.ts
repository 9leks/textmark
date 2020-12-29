import { MobxReactionUpdate } from "@adobe/lit-mobx"
import { css, html, LitElement, TemplateResult } from "lit-element"
import * as store from "../store"

export default class AppNumberLine extends MobxReactionUpdate(LitElement) {
  static tag = "app-numberline"

  // TODO: clicking and dragging over numbers selects entire line

  render(): TemplateResult {
    return html`${store.text.lines.map(
      (_, y: number) => html`<div class="line" active=${y === store.cursor.y}>${y}</div>`
    )}`
  }

  static styles = css`
    :host {
      min-width: 6.5ch;
      flex-direction: column;
      pointer-events: none;
      user-select: none;
    }

    .line {
      padding-right: 2ch;
      padding-left: 4.5ch;
      color: #888;
      color: #000d;
      direction: rtl;
      font-size: 0.9em;
    }

    .line[active="true"] {
      background-color: var(--active-bg-color);
      box-shadow:
        inset 0 1px 1px -1px var(--active-box-shadow-color),
        inset 0 -1px 1px -1px var(--active-box-shadow-color);
      color: var-(--active-font-color);
      font-weight: var(--active-font-weight);
    }
  `
}
