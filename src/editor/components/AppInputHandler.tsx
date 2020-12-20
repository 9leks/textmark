import React, { Dispatch, FormEvent, FunctionComponent, KeyboardEvent, SetStateAction, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { State } from './AppRoot'

type InputHandler = {
  setState: Dispatch<SetStateAction<State>>
  setInputHandlerRef: Dispatch<unknown>
}

const AppInputHandler: FunctionComponent<InputHandler> = ({ setState, setInputHandlerRef }) => {
  const inputHandlerRef = useRef(null)

  useEffect(() => {
    setInputHandlerRef(inputHandlerRef)
  }, [])

  const handleKeyDown = (evt: KeyboardEvent) => {
    switch (evt.key) {
      case 'Enter': {
        return void setState(state => {
          const { cursor, lines } = state
          const { x, y } = cursor

          if (x === 0) {
            return { cursor: { x: 0, y: y + 1 }, lines: [...lines.slice(0, y), '', ...lines.slice(y)] }
          } else if (x === lines[y].length) {
            return { cursor: { x: 0, y: y + 1 }, lines: [...lines.slice(0, y + 1), '', ...lines.slice(y + 1)] }
          } else {
            return {
              cursor: { x: 0, y: y + 1 },
              lines: [...lines.slice(0, y), lines[y].slice(0, x), lines[y].slice(x), ...lines.slice(y + 1)]
            }
          }
        })
      }
      case 'Backspace': {
        return void setState(state => {
          const { cursor, lines } = state
          const { x, y } = cursor

          if (x === 0) {
            if (y === 0) {
              return state
            }
            return {
              cursor: { x: lines[y - 1].length, y: y - 1 },
              lines: [...lines.slice(0, y - 1), lines[y - 1] + lines[y], ...lines.slice(y + 1)]
            }
          }
          return {
            cursor: { x: x - 1, y },
            lines: [...lines.slice(0, y), lines[y].slice(0, x - 1) + lines[y].slice(x), ...lines.slice(y + 1)]
          }
        })
      }
      case 'Home': {
        return void setState(state => {
          const { cursor } = state
          const { y } = cursor
          return { ...state, cursor: { x: 0, y } }
        })
      }
      case 'End': {
        return void setState(state => {
          const { cursor, lines } = state
          const { y } = cursor
          return { ...state, cursor: { x: lines[y].length, y } }
        })
      }
      case 'PageUp': {
        return void setState(state => ({ ...state, cursor: { x: 0, y: 0 } }))
      }
      case 'PageDown': {
        return void setState(state => {
          const { lines } = state
          return { ...state, cursor: { x: lines[lines.length - 1].length, y: lines.length - 1 } }
        })
      }
      case 'ArrowLeft': {
        return void setState(state => {
          const { cursor, lines } = state
          const { x, y } = cursor

          if (x === 0) {
            if (y === 0) {
              return state
            }
            return { ...state, cursor: { x: lines[y - 1].length, y: y - 1 } }
          } else if (evt.altKey || evt.ctrlKey) {
            return { ...state, cursor: { x: lines[y].lastIndexOf(' ', x - 2) + 1, y } }
          } else {
            return { ...state, cursor: { x: x - 1, y } }
          }
        })
      }
      case 'ArrowRight': {
        return void setState(state => {
          const { cursor, lines } = state
          const { x, y } = cursor

          if (x === lines[y].length) {
            if (y === lines.length - 1) {
              return state
            }
            return { ...state, cursor: { x: 0, y: y + 1 } }
          } else if (evt.altKey || evt.ctrlKey) {
            return { ...state, cursor: { x: lines[y].indexOf(' ', x) + 1, y } }
          } else {
            return { ...state, cursor: { x: x + 1, y } }
          }
        })
      }
      case 'ArrowUp': {
        return void setState(state => {
          const { cursor, lines } = state
          const { x, y } = cursor

          if (y === 0) {
            return state
          }

          if (evt.altKey || evt.ctrlKey) {
            return {
              cursor: { x, y: y - 1 },
              lines: [...lines.slice(0, y - 1), lines[y], lines[y - 1], ...lines.slice(y + 1)]
            }
          }

          return { ...state, cursor: { x: lines[y - 1].length >= x ? x : lines[y - 1].length, y: y - 1 } }
        })
      }
      case 'ArrowDown': {
        return void setState(state => {
          const { cursor, lines } = state
          const { x, y } = cursor

          if (y === lines.length - 1) {
            return state
          }

          if (evt.altKey || evt.ctrlKey) {
            return {
              cursor: { x, y: y + 1 },
              lines: [...lines.slice(0, y), lines[y + 1], lines[y], ...lines.slice(y + 2)]
            }
          }

          return { ...state, cursor: { x: lines[y + 1].length >= x ? x : lines[y + 1].length, y: y + 1 } }
        })
      }
    }
  }

  const handleInput = (evt: FormEvent) => {
    const input = evt.target as HTMLTextAreaElement
    const char = input.value

    if (char.includes('\n')) {
      return
    }

    return void setState(state => {
      const { cursor, lines } = state
      const { x, y } = cursor

      input.value = ''

      return {
        cursor: { x: x + 1, y },
        lines: [...lines.slice(0, y), lines[y].slice(0, x) + char + lines[y].slice(x), ...lines.slice(y + 1)]
      }
    })
  }

  return <TextArea onKeyDown={handleKeyDown} onInput={handleInput} autoFocus ref={inputHandlerRef} />
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
