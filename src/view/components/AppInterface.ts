import { css, html, LitElement, TemplateResult } from "lit-element"

export default class AppInterface extends LitElement {
  static tag = "app-interface"

  render(): TemplateResult {
    return html`
      <span class="lines">
        <app-numberline></app-numberline>
        <app-editor></app-editor>
      </span>
      <app-statusbar></app-statusbar>
    `
  }

  static styles = css`
    :host {
      display: flex;
      height: 100%;
      flex-direction: column;
      font-family: "SF Mono", "Courier", monospace;
    }

    .lines {
      display: flex;
      overflow: auto;
      flex: 1;
      line-height: var(--editor-line-height);
    }

    ::-webkit-scrollbar {
      width: 0.7em;
      height: 0.7em;
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
