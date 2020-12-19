import React, { Dispatch, FormEvent, FunctionComponent, useEffect, useRef } from 'react'
import styled from 'styled-components'

type Reader = {
  readInput: (input: string) => void
  initInputReader: Dispatch<unknown>

}

const InputReader: FunctionComponent<Reader> = ({ readInput, initInputReader }) => {
  const inputReaderRef = useRef(null)

  useEffect(() => { 
    initInputReader(inputReaderRef)
  }, [])

  const handleInput = (evt: FormEvent) => {
    const target = evt.target as HTMLTextAreaElement
    readInput(target.value)
    target.value = ''
  }

  return <TextArea onInput={handleInput} autoFocus ref={inputReaderRef} />
}

export default InputReader

const TextArea = styled.textarea`
  position: absolute;
  width: 0;
  height: 0;
  margin: 0;
  padding: 0;
  border: none;
`
