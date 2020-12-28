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
      min-width: 0;
      padding-left: 4.5ch;
      color: #888;
      direction: rtl;
      font-size: 0.9em;
      line-height: 1.7em;
      pointer-events: none;
      user-select: none;
    }
  `
}
