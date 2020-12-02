import React, { FunctionComponent, CSSProperties } from 'react'

type Editor = {
  lines: string[]
}

const Editor: FunctionComponent<Editor> = ({ lines }) => {
  const editorSettings = {
    '--max-width': '80ch',
    '--line-height': '24px',
    '--font-size': '18px',
    '--font-family': 'monospace'
  } as CSSProperties

  return (
    <div className="lines" style={editorSettings}>
      {lines.map((line, i) => (
        <div className="line" key={i}>
          <div className="line-number">{i + 1}</div>
          <div
            className="line-text"
            contentEditable
            suppressContentEditableWarning
          >
            {line}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Editor
