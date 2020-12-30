import { css, html, LitElement, TemplateResult } from "lit-element"

export default class Root extends LitElement {
  render(): TemplateResult {
    return html`
      <span id="main">
        <app-numberline></app-numberline>
        <app-textarea></app-textarea>
      </span>
      <app-statusbar></app-statusbar>
      <app-inputhandler></app-inputhandler>
    `
  }

  static styles = css`
    :host {
      display: flex;
      height: 100%;
      flex-direction: column;
      font-family: "SF Mono", "Courier New", monospace;
      font-size: 16px;
    }

    #main {
      --focused-font-weight: 450;

      display: flex;
      overflow: hidden;
      flex: 1;
      line-height: 28px;
    }

    ::-webkit-scrollbar {
      width: 0.6em;
      height: 0.6em;
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: #ddd;
      box-shadow: inset 0 0 1px #0005;
    }

    ::-webkit-scrollbar-corner {
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb:hover {
      background-color: #77777773;
    }
  `
}
