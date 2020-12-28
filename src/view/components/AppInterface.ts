import { css, html, LitElement, TemplateResult } from "lit-element"

export default class AppInterface extends LitElement {
  static tag = "app-interface"

  render(): TemplateResult {
    return html`
      <app-numberline></app-numberline>
      <app-editor></app-editor>
      <app-statusbar></app-statusbar>
    `
  }

  static styles = css`
    :host {
      display: grid;
      padding: 1em;
      margin-bottom: 2em;
      font-family: "SF Mono", "Courier", monospace;
      grid-auto-flow: column;
      grid-column-gap: 1em;
    }
  `
}
