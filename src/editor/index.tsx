import React from 'react'
import { render } from 'react-dom'
import AppRoot from './components/AppRoot'
import './index.css'

window.main.onReady((lines: string[]) => {
  render(<AppRoot initialLines={lines} />, document.getElementById('app'))
})
