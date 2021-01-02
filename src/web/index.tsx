import React, { createContext } from 'react'
import { render } from 'react-dom'
import Root from './components/Root'
import store from './store'

export const StoreContext = createContext<Store>(store)

window.api.onReady((payload: Payload) => {
  store.setText(payload.text)
  store.setCoords(payload.coords.x, payload.coords.y)

  render(
    <StoreContext.Provider value={store}>
      <Root />
    </StoreContext.Provider>,
    document.querySelector('#root')
  )
})
