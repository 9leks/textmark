import React, { Fragment, FunctionComponent, useState } from 'react'
import AppEditor from './AppEditor'
import AppInputHandler from './AppInputHandler'

type Root = {
  initialLines: string[]
}

const AppRoot: FunctionComponent<Root> = ({ initialLines }) => {
  const [lines, setLines] = useState(initialLines)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [inputHandlerRef, setInputHandlerRef] = useState(null)

  return (
    <Fragment>
      <AppInputHandler
        lines={lines}
        setLines={setLines}
        setCursor={setCursor}
        setInputHandlerRef={setInputHandlerRef}
      />
      <AppEditor lines={lines} cursor={cursor} setCursor={setCursor} inputHandlerRef={inputHandlerRef} />
    </Fragment>
  )
}

export default AppRoot
