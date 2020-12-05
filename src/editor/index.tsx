import React from 'react'
import { render } from 'react-dom'

import './styles/index'
import Editor from './components/Editor'

window.main.onReady((lines: string[]) => {
  render(<Editor initialLines={lines} />, document.getElementById('app'))
})
