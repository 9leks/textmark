import AppEditor from "./components/AppEditor"
import AppInputHandler from "./components/AppInputHandler"
import AppInterface from "./components/AppInterface"
import AppNumberLine from "./components/AppNumberLine"
import AppRoot from "./components/AppRoot"
import AppStatusbar from "./components/AppStatusbar"
import * as store from "./store"

customElements.get(AppInputHandler.tag) || customElements.define(AppInputHandler.tag, AppInputHandler)
customElements.get(AppEditor.tag) || customElements.define(AppEditor.tag, AppEditor)
customElements.get(AppInterface.tag) || customElements.define(AppInterface.tag, AppInterface)
customElements.get(AppNumberLine.tag) || customElements.define(AppNumberLine.tag, AppNumberLine)
customElements.get(AppRoot.tag) || customElements.define(AppRoot.tag, AppRoot)
customElements.get(AppStatusbar.tag) || customElements.define(AppStatusbar.tag, AppStatusbar)

window.api.onReady((payload: { lines: string[]; cursor: { x: number; y: number } }) => {
  store.text.set(payload.lines)
  store.cursor.set(payload.cursor.x, payload.cursor.y)
})
