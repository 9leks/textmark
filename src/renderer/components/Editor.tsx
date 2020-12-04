import React, { FunctionComponent, CSSProperties, useState } from 'react'

type Editor = {
  initialLines: string[]
}

const Editor: FunctionComponent<Editor> = ({ initialLines }) => {
  const [lines, setLines] = useState(initialLines)

  const editorSettings = {
    '--max-width': '80ch',
    '--line-height': '24px',
    '--font-size': '18px',
    '--font-family': 'monospace',
  } as CSSProperties

  const handleKeyDown = () => {
    const span = window.getSelection().anchorNode.parentNode as HTMLSpanElement
    const line = Number(span.getAttribute('data-key'))
    const content = span.textContent

    setLines(prev => {
      const next = [...prev]
      next[line] = content
      return next
    })
  }

  return (
    <ol
      id="editor"
      className="lines"
      style={editorSettings}
      contentEditable
      suppressContentEditableWarning
      onSelect={handleKeyDown}
    >
      {lines.map((line, i) => (
        <li className="line" key={i}>
          <span className="line-text" data-key={i}>
            {line}
          </span>
        </li>
      ))}
    </ol>
  )
}

export default Editor
