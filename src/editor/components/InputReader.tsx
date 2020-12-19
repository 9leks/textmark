import React, { Dispatch, FunctionComponent, KeyboardEvent, SetStateAction, useEffect, useRef } from 'react'
import styled from 'styled-components'

type Reader = {
  setLines: Dispatch<SetStateAction<string[]>>
  cursor: { x: number; y: number }
  setCursor: Dispatch<SetStateAction<{ x: number; y: number }>>
  setReaderRef: Dispatch<unknown>
}

const AppReader: FunctionComponent<Reader> = ({ cursor, setCursor, setLines, setReaderRef }) => {
  const readerRef = useRef(null)

  useEffect(() => {
    setReaderRef(readerRef)
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
      case 'LeftArrow': {
        console.log('Pressed', evt.key)
        return
      }
      case 'RightArrow': {
        console.log('Pressed', evt.key)
        return
      }
      case 'UpArrow': {
        console.log('Pressed', evt.key)
        return
      }
      case 'DownArrow': {
        console.log('Pressed', evt.key)
        return
      }
      default: {
        console.log('Pressed', evt.key)
      }
    }

    const target = evt.target as HTMLTextAreaElement
    target.value = ''
  }

  return <TextArea onKeyDown={handleKeyDown} autoFocus ref={readerRef} />
}

export default AppReader

const TextArea = styled.textarea`
  position: absolute;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: none;
`
