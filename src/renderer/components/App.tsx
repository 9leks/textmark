import React, { FunctionComponent } from 'react'

type App = {
  file: string
  contents: string[]
}

const App: FunctionComponent<App> = ({ file, contents }) => {
  return (
    <div>
      <b>filename</b>: <div>{file}.</div>
      <b>contents:</b>{' '}
      <div>
        {contents.map((line, i) => (
          <div key={i}>
            {i} {line}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
