import React, { FunctionComponent, MutableRefObject, MouseEvent, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

type Editor = {
  lines: string[]
  inputHandlerRef: MutableRefObject<HTMLTextAreaElement>
}

const AppEditor: FunctionComponent<Editor> = ({ lines, inputHandlerRef }) => {
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  const handleClick = (evt: MouseEvent) => {
    inputHandlerRef.current.focus()

    const character = evt.target as HTMLSpanElement

    if (character.parentElement.hasAttribute('data-line')) {
      const x = Number(character.getAttribute('data-char-index'))
      const y = Number(character.getAttribute('data-line-number'))
      setCoords({ x, y })
    }
  }

  return (
    <Container onClick={handleClick}>
      {coords.x}:{coords.y}
      {lines.map((line, lineNumber) => (
        <Line key={lineNumber}>
          <LineNumber data-number>{lineNumber}</LineNumber>
          <LineText data-line>
            {[...line].map((char, charIndex) => (
              <Character
                key={charIndex}
                onClick={handleClick}
                data-char-index={charIndex}
                data-line-number={lineNumber}
                data-active={charIndex === coords.x && lineNumber === coords.y}
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

const animation = keyframes`
  50% {
    box-shadow: 2px 0px 0px 0px #555;
  }
`

const Character = styled('span')<{ 'data-active': boolean }>`
  ${({ 'data-active': active }) =>
    active &&
    css`
      animation: ${animation} 1s step-start infinite;
    `}
`
