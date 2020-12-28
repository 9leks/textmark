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
      height: 1.75em;
      align-items: center;
      background-color: #aaa;
      font-family: "SF Mono", "Courier", monospace;
    }

    .position {
      margin-left: 0.5em;
    }
  `
}
