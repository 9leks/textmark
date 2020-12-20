import React, { FunctionComponent, MutableRefObject, MouseEvent, Dispatch, SetStateAction } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { State } from './AppRoot'

type Editor = {
  state: State
  setState: Dispatch<SetStateAction<State>>
  inputHandlerRef: MutableRefObject<HTMLTextAreaElement>
}

const AppEditor: FunctionComponent<Editor> = ({ state, setState, inputHandlerRef }) => {
  const handleClick = (evt: MouseEvent) => {
    inputHandlerRef.current.focus()

    const target = evt.target as HTMLDivElement | HTMLSpanElement

    if (target instanceof HTMLDivElement) {
      const y = Number(target.getAttribute('data-line-number'))
      const x = state.lines[y].length
      const cursor = { x, y }
      setState({ ...state, cursor })
    } else if (target instanceof HTMLSpanElement) {
      const y = Number(target.getAttribute('data-line-number'))
      const x = Number(target.getAttribute('data-char-index'))
      const cursor = { x, y }
      setState({ ...state, cursor })
    }
  }

  return (
    <Container onClick={handleClick}>
      {state.cursor.x}:{state.cursor.y}
      {state.lines.map((line, lineNumber) => (
        <Line key={lineNumber} onClick={handleClick} data-line-number={lineNumber}>
          <LineNumber>{lineNumber}</LineNumber>
          <LineText data-line-number={lineNumber}>
            {['\u00a0', ...line].map((char, charIndex) => (
              <Character
                key={charIndex}
                onClick={handleClick}
                data-is-blank={charIndex === 0}
                data-is-active={charIndex === state.cursor.x && lineNumber === state.cursor.y}
                data-char-index={charIndex}
                data-line-number={lineNumber}
              >
                {char === ' ' ? '\u00a0' : char}
              </Character>
            ))}
          </LineText>
        </Line>
      ))}
    </Container>
  )
}

export default AppEditor

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1em;
  font-family: 'SF Mono', monospace;
`

const Line = styled.div`
  display: flex;
  flex-direction: row;
  cursor: text;
`

const LineNumber = styled.div`
  margin-right: 0.25em;
  color: #555;
  user-select: none;
`

const LineText = styled.div``

const blink = keyframes`
  50% {
    box-shadow: 2px 0px 0px 0px #555;
  }
`

const Character = styled('span')<{ 'data-is-active': boolean; 'data-is-blank': boolean }>`
  ${({ 'data-is-active': isActive }) =>
    isActive &&
    css`
      animation: ${blink} 1s step-start infinite;
    `}

  ${({ 'data-is-blank': isBlank }) =>
    isBlank &&
    `
      user-select: none;
    `}
`
