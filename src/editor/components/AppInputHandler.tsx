import React, { Dispatch, FunctionComponent, KeyboardEvent, SetStateAction, useEffect, useRef } from 'react'
import styled from 'styled-components'

type InputHandler = {
  lines: string[]
  setLines: Dispatch<SetStateAction<string[]>>
  setCursor: Dispatch<SetStateAction<{ x: number; y: number }>>
  setInputHandlerRef: Dispatch<unknown>
}

const AppInputHandler: FunctionComponent<InputHandler> = ({ setCursor, lines, setLines, setInputHandlerRef }) => {
  const inputHandlerRef = useRef(null)

  useEffect(() => {
    setInputHandlerRef(inputHandlerRef)
  }, [])

  const handleKeyDown = (evt: KeyboardEvent) => {
    switch (evt.key) {
      case 'Enter': {
        console.log('Pressed', evt.key)
        return
      }
      case 'Backspace': {
        console.log('Pressed', evt.key)
        return
      }
      case 'ArrowLeft': {
        return void setCursor(cursor => {
          if (cursor.x === 0) {
            if (cursor.y === 0) {
              return cursor
            } else {
              const y = cursor.y - 1
              const x = lines[cursor.y - 1].length
              return { x, y }
            }
          } else {
            const y = cursor.y
            const x = cursor.x - 1
            return { x, y }
          }
        })
      }
      case 'ArrowRight': {
        return void setCursor(cursor => {
          if (cursor.x === lines[cursor.y].length) {
            if (cursor.y === lines.length - 1) {
              return cursor
            } else {
              const y = cursor.y + 1
              const x = 0
              return { x, y }
            }
          } else {
            const y = cursor.y
            const x = cursor.x + 1
            return { x, y }
          }
        })
      }
      case 'ArrowUp': {
        return void setCursor(cursor => {
          if (cursor.y === 0) {
            return cursor
          } else {
            const y = cursor.y - 1
            const x = lines[cursor.y - 1].length < cursor.x ? lines[cursor.y - 1].length : cursor.x
            return { x, y }
          }
        })
      }
      case 'ArrowDown': {
        return void setCursor(cursor => {
          if (cursor.y === lines.length - 1) {
            return cursor
          } else {
            const y = cursor.y + 1
            const x = lines[cursor.y + 1].length < cursor.x ? lines[cursor.y + 1].length : cursor.x
            return { x, y }
          }
        })
      }
      default: {
        console.log('Pressed', evt.key)
      }
    }

    const target = evt.target as HTMLTextAreaElement
    target.value = ''
  }

  return <TextArea onKeyDown={handleKeyDown} autoFocus ref={inputHandlerRef} />
}

export default AppInputHandler

const TextArea = styled.textarea`
  position: absolute;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: none;
`
