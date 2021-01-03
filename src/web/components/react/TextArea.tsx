import React, { FunctionComponent, useContext, useEffect, useRef } from 'react'
import { StoreContext } from '../../index'
import XTextArea from '../web/x-textarea'

if (!customElements.get('x-textarea')) {
  customElements.define('x-textarea', XTextArea)
}

interface ITextArea {
  onInput: (e: CustomEvent<XInputEvent>) => void
}

const TextArea: FunctionComponent<ITextArea> = ({ onInput }) => {
  const { conf, x, y, text } = useContext(StoreContext)
  const { lineHeight, fontSize, fontFamily } = conf
  const ref = useRef<XTextArea>()

  useEffect(() => {
    ref.current?.addEventListener('on-input', (e: CustomEvent<XInputEvent>) => {
      onInput(e)
    })
  }, [ref])

  return (
    <x-textarea
      ref={ref}
      value={text}
      x={x}
      y={y}
      line-height={lineHeight}
      font-size={fontSize}
      font-family={fontFamily}
    ></x-textarea>
  )
}

export default TextArea
