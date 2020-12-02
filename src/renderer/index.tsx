import React from 'react'
import { render } from 'react-dom'

import './styles/index'
import App from './components/App'

window.main.onReady((file: string, contents: string[]) => {
  render(
    <App file={file} contents={contents} />,
    document.getElementById('app')
  )
})
