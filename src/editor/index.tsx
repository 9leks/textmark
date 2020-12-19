import React, { Fragment } from 'react'
import { render } from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import AppRoot from './components/AppRoot'

const Global = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
  }
`

window.main.onReady((lines: string[]) => {
  render(
    <Fragment>
      <Global />
      <AppRoot initialLines={lines} />
    </Fragment>,
    document.getElementById('app')
  )
})
