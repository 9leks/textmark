import React, { Fragment, FunctionComponent, useState } from 'react'
import AppEditor from './AppEditor'
import AppInputHandler from './AppInputHandler'

type Root = {
  initialLines: string[]
}

export interface State {
  lines: string[]
  cursor: {
    x: number
    y: number
  }
}

const AppRoot: FunctionComponent<Root> = ({ initialLines }) => {
  const [state, setState] = useState({ lines: initialLines, cursor: { x: 0, y: 0 } })
  const [inputHandlerRef, setInputHandlerRef] = useState(null)

  return (
    <Fragment>
      <AppInputHandler setState={setState} setInputHandlerRef={setInputHandlerRef} />
      <AppEditor state={state} setState={setState} inputHandlerRef={inputHandlerRef} />
    </Fragment>
  )
}

export default AppRoot
