import React, { FunctionComponent } from 'react'

type App = {
  file: string
  contents: string[][]
}

const App: FunctionComponent<App> = ({ file, contents }) => {
  console.log(contents)

  return (
    <div className="lines" contentEditable suppressContentEditableWarning>
      {contents.map((lines, i) => (
        <div className="line" key={i}>
          <div className="line-number" contentEditable={false}>
            {i + 1}
          </div>
          <div>
            {lines.map((line, j) => (
              <div className="line-text" key={j}>
                {line}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
