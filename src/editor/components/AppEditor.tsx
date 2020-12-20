import React, { FunctionComponent, MutableRefObject, MouseEvent, Dispatch, SetStateAction } from 'react'
import styled, { css, keyframes } from 'styled-components'

type Editor = {
  lines: string[]
  cursor: { x: number; y: number }
  setCursor: Dispatch<SetStateAction<{ x: number; y: number }>>
  inputHandlerRef: MutableRefObject<HTMLTextAreaElement>
}

const AppEditor: FunctionComponent<Editor> = ({ lines, cursor, setCursor, inputHandlerRef }) => {
  const handleClick = (evt: MouseEvent) => {
    inputHandlerRef.current.focus()

    const target = evt.target as HTMLDivElement | HTMLSpanElement

    if (target instanceof HTMLDivElement) {
      const y = Number(target.getAttribute('data-line-number'))
      const x = lines[y].length
      setCursor({ x, y })
    } else if (target instanceof HTMLSpanElement) {
      const y = Number(target.getAttribute('data-line-number'))
      const x = Number(target.getAttribute('data-char-index'))
      setCursor({ x, y })
    }
  }

  return (
    <Container onClick={handleClick}>
      {cursor.x}:{cursor.y}
      {lines.map((line, lineNumber) => (
        <Line key={lineNumber} onClick={handleClick} data-line-number={lineNumber}>
          <LineNumber>{lineNumber}</LineNumber>
          <LineText data-line-number={lineNumber}>
            {['\u00a0', ...line].map((char, charIndex) => (
              <Character
                key={charIndex}
                onClick={handleClick}
                data-char-index={charIndex}
                data-line-number={lineNumber}
                data-active={charIndex === cursor.x && lineNumber === cursor.y}
              >
                {char}
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
  width: 100vw;
  height: 100vh;
  padding: 1em;
  font-family: 'SF Mono', monospace;
`

const Line = styled.div`
  display: flex;
  flex-direction: row;
`

const LineNumber = styled.div`
  margin-right: 12px;
  color: #555;
  user-select: none;
`

const LineText = styled.div`
  margin-left: -1ch;
`

const blink = keyframes`
  50% {
    box-shadow: 2px 0px 0px 0px #555;
  }
`

const Character = styled('span')<{ 'data-active': boolean }>`
  ${({ 'data-active': active }) =>
    active &&
    css`
      animation: ${blink} 1s step-start infinite;
    `}
`
