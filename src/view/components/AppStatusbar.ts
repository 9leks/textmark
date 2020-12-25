import { MobxReactionUpdate } from "@adobe/lit-mobx"
import { css, html, LitElement, TemplateResult } from "lit-element"
import * as store from "../store"

export default class AppStatusbar extends MobxReactionUpdate(LitElement) {
  static tag = "app-statusbar"

  render(): TemplateResult {
    return html`<div class="cursor">${store.cursor.x}:${store.cursor.y}</div>`
  }

  static styles = css`
    :host {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: #ddd;
      user-select: none;
    }

    .cursor {
      padding: 0.25em;
    }
  `
}
