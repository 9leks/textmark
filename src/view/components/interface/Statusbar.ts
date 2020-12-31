import { MobxReactionUpdate } from '@adobe/lit-mobx'
import { css, html, LitElement, TemplateResult } from 'lit-element'
import store from '../../store'

export default class Statusbar extends MobxReactionUpdate(LitElement) {
  render(): TemplateResult {
    return html`<div class="position">${store.x}:${store.y}</div>`
  }

  static styles = css`
    :host {
      display: flex;
      height: 2em;
      align-items: center;
      box-shadow: inset 0 0 3px #0005;
      font-family: 'SF Mono', 'Courier', monospace;
    }

    .position {
      margin-left: 0.5em;
      color: #000c;
    }
  `
}
