import { html, LitElement, TemplateResult } from "lit-element"

export default class AppRoot extends LitElement {
  static tag = "app-root"

  render(): TemplateResult {
    return html`
      <app-input-handler /></app-input-handler>
      <app-cursor></app-cursor>
      <app-interface /></app-interface>
    `
  }
}
