import React, { FunctionComponent, MutableRefObject } from 'react'
import styled from 'styled-components'

type Editor = {
  lines: string[]
  inputHandlerRef: MutableRefObject<HTMLTextAreaElement>
}

const AppEditor: FunctionComponent<Editor> = ({ lines, inputHandlerRef }) => {
  const handleClick = () => {
    inputHandlerRef.current.focus()
  }

  return (
    <Container>
      {lines.map((line, number) => (
        <Line key={number} onClick={handleClick}>
          <LineNumber data-number>{number}</LineNumber>
          <LineText data-line>{line}</LineText>
        </Line>
      ))}
    </Container>
  )
}

export default AppEditor

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 1em;
  font-family: 'SF Mono';
  line-height: 28px;
`

const Line = styled.div`
  display: flex;
  flex-direction: row;

  [data-number] {
    margin-right: 12px;
    color: #555;
  }
`

const LineNumber = styled.div`
  user-select: none;
`

const LineText = styled.div`
  max-width: 80ch;
`
