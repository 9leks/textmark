import { MobxReactionUpdate } from "@adobe/lit-mobx"
import { css, html, LitElement, TemplateResult } from "lit-element"
import * as store from "../store"

export default class AppStatusbar extends MobxReactionUpdate(LitElement) {
  static tag = "app-statusbar"

  render(): TemplateResult {
    return html`<div class="position">${store.cursor.x}:${store.cursor.y}</div>`
  }

  static styles = css`
    :host {
      display: flex;
      height: 2em;
      align-items: center;
      box-shadow: inset 0 0 3px #0005;
      font-family: "SF Mono", "Courier", monospace;
    }

    .position {
      margin-left: 0.5em;
      color: #000c;
    }
  `
}
