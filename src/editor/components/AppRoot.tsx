import React, { Fragment, FunctionComponent, useState } from 'react'
import AppEditor from './AppEditor'
import InputReader from './InputReader'

type Root = {
  initialLines: string[]
}

const AppRoot: FunctionComponent<Root> = ({ initialLines }) => {
  const [lines, setLines] = useState(initialLines)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [readerRef, setReaderRef] = useState(null)

  return (
    <Fragment>
      <InputReader setLines={setLines} cursor={cursor} setCursor={setCursor} setReaderRef={setReaderRef} />
      <AppEditor lines={lines} cursor={cursor} setCursor={setCursor} readerRef={readerRef} />
    </Fragment>
  )
}

export default AppRoot
