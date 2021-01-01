import React, { FunctionComponent, useEffect, useRef } from 'react'
import XTextArea from '../web/x-textarea'

if (!customElements.get('x-textarea')) {
  customElements.define('x-textarea', XTextArea)
}

const TextArea: FunctionComponent<TextAreaProps> = ({ value, onChange, fontSize, fontFamily, lineHeight, x, y }) => {
  const ref = useRef<XTextArea>()

  useEffect(() => {
    ref.current?.addEventListener('on-input', (e: CustomEvent<InputEvent>) => {
      onChange(e)
    })
  }, [ref])

  return (
    <x-textarea
      ref={ref}
      value={value}
      x={y}
      y={x}
      line-height={lineHeight}
      font-size={fontSize}
      font-family={fontFamily}
    ></x-textarea>
  )
}

export default TextArea
