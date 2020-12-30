import components from "./components"
import store from "./store"

for (const { component, tag } of components) {
  customElements.get(tag) || customElements.define(tag, component)
}

window.api.onReady((payload: { lines: string[]; coords: { x: number; y: number } }) => {
  store.setLines(payload.lines)
  store.setCoords(payload.coords.x, payload.coords.y)
})
