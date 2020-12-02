import React, { FunctionComponent } from 'react'

type App = {
  file: string
  contents: string[][]
}

const App: FunctionComponent<App> = ({ file, contents }) => {
  console.log(contents)

  return (
    <div className="lines">
      {contents.map((lines, i) => (
        <div className="line" key={i}>
          <div className="line-number">{i + 1}</div>
          <div className="line-text">
            {lines.map((line, j) => (
              <div className="line-text-soft" key={j}>
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
