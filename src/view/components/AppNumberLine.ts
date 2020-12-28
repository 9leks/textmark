import { MobxReactionUpdate } from "@adobe/lit-mobx"
import { css, html, LitElement, TemplateResult } from "lit-element"
import * as store from "../store"

export default class AppNumberLine extends MobxReactionUpdate(LitElement) {
  static tag = "app-numberline"

  render(): TemplateResult {
    return html`${store.text.lines.map((_, i: number) => html`<div>${i}</div>`)}`
  }

  static styles = css`
    :host {
      display: grid;
      min-width: 0;
      padding-left: 3ch;
      color: #888;
      direction: rtl;
      font-size: 0.9em;
      pointer-events: none;
    }
  `
}
