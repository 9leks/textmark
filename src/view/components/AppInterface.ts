import { css, html, LitElement, TemplateResult } from "lit-element"

export default class AppInterface extends LitElement {
  static tag = "app-interface"

  render(): TemplateResult {
    return html`
      <span>
        <app-numberline></app-numberline>
        <app-editor></app-editor>
      </span>
      <app-statusbar></app-statusbar>
    `
  }

  static styles = css`
    ::-webkit-scrollbar {
      width: 0.7em;
      height: 0.7em;
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: #ddd;
    }

    ::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    :host {
      display: grid;
      height: 100%;
      font-family: "SF Mono", "Courier", monospace;
      grid-template-areas:
        "h h"
        "f f";
      grid-template-rows: 1fr auto;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #77777773;
    }

    span {
      display: flex;
      overflow: auto;
      padding-top: 1em;
      gap: 1em;
      grid-area: h;
    }

    app-numberline {
      grid-area: n;
    }

    app-editor {
      grid-area: e;
    }

    app-statusbar {
      grid-area: f;
    }
  `
}
