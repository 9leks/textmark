import React, { FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import AppEditor from './AppEditor'
import InputReader from './InputReader'

type Root = {
  initialLines: string[]
}

const AppRoot: FunctionComponent<Root> = ({ initialLines }) => {
  const [lines, setLines] = useState(initialLines)
  const [inputHandlerRef, initInputReader] = useState(null)

  const readInput = (input: string) => {
    setLines(old => [...old, input])
  }

  return (
    <Container>
      <InputReader readInput={readInput} initInputReader={initInputReader} />
      <AppEditor lines={lines} inputHandlerRef={inputHandlerRef} />
    </Container>
  )
}

export default AppRoot

const Container = styled.span``
