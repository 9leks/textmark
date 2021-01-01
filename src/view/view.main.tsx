import React, { createContext } from 'react'
import { render } from 'react-dom'
import Root from './components/Root'
import store from './store'

export const StoreContext = createContext(store)

window.api.onReady((payload) => {
  store.setText(payload.text)
  store.setCoords(payload.coords.x, payload.coords.y)

  render(
    <StoreContext.Provider value={store}>
      <Root />
    </StoreContext.Provider>,
    document.querySelector('#root')
  )
})
