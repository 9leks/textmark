import React, { FunctionComponent, useState, useRef, FormEvent, KeyboardEvent } from 'react'
import { editorSettings } from '../editor-settings'

type Editor = {
  initialLines: string[]
}

const BLANK = '\u2800'
const SPACE = '\u00a0'

const Editor: FunctionComponent<Editor> = ({ initialLines }) => {
  const [lines, setLines] = useState(initialLines.map(line => line + BLANK))
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const textAreaRef = useRef()
  const editorRef = useRef()

  const handleMouseClick = (e: FormEvent) => {
    const target = e.target as HTMLSpanElement
    const y = Number(target.getAttribute('data-line-nr'))

    if (!lines[y]) {
      const x = 0
      setCursor({ x, y })
      return
    }

    const x = Number(target.getAttribute('data-char-pos'))
    setCursor({ x, y })

    const textArea = textAreaRef.current as HTMLTextAreaElement
    textArea.focus()
  }

  const handleTextInput = () => {
    setLines(prev => {
      const textArea = textAreaRef.current as HTMLTextAreaElement
      const { x, y } = cursor

      const editor = editorRef.current as HTMLDivElement
      const line = editor.childNodes[y].lastChild.textContent
      const text = textArea.value === ' ' ? SPACE : textArea.value
      const nextText = [...prev]

      nextText[y] = [line.slice(0, x), text, line.slice(x)].join('')

      textArea.value = ''
      setCursor({ x: x + 1, y })
      return nextText
    })
  }

  const handleCaretMovement = (e: KeyboardEvent) => {
    const editor = editorRef.current as HTMLDivElement
    const children = editor.childNodes
    const { x, y } = cursor

    switch (e.key) {
      case 'Enter': {
        e.preventDefault()

        const currLine = children[y].lastChild.textContent

        setLines(prev => {
          const nextLines = [...prev]
          if (x === currLine.length - 1) {
            nextLines.splice(y + 1, 0, BLANK)
          } else if (x === 0) {
            nextLines.splice(y, 0, BLANK)
          } else {
            nextLines[y] = prev[y].slice(0, x) + BLANK
            nextLines.splice(y + 1, 0, prev[y].slice(x))
          }
          return nextLines
        })

        setCursor({ x: 0, y: y + 1 })
        return
      }
      case 'Backspace': {
        if (x === 0) {
          if (y === 0) {
            return
          }

          const nextLine = children[y - 1].lastChild.textContent
          setLines(prev => {
            const nextText = [...prev]
            nextText[y - 1] = prev[y - 1].slice(0, -1)
            nextText[y - 1] += prev[y]
            nextText.splice(y, 1)
            return nextText
          })

          setCursor({ x: nextLine.length - 1, y: y - 1 })
        } else {
          setLines(prev => {
            const nextText = [...prev]
            nextText[y] = prev[y].slice(0, x - 1) + prev[y].slice(x)
            setCursor({ x: x - 1, y })
            return nextText
          })
        }

        return
      }
      case 'ArrowDown': {
        if (y === children.length - 1) {
          return
        }

        const nextLine = children[y + 1].lastChild.textContent
        setCursor({
          x: x > nextLine.length - 1 ? nextLine.length - 1 : x,
          y: y + 1,
        })

        return
      }
      case 'ArrowUp': {
        if (y === 0) {
          return
        }

        const nextLine = children[y - 1].lastChild.textContent
        setCursor({
          x: x > nextLine.length - 1 ? nextLine.length - 1 : x,
          y: y - 1,
        })

        return
      }
      case 'ArrowLeft': {
        if (x === 0) {
          if (y == 0) {
            return
          }
          const nextLine = children[y - 1].lastChild.textContent
          setCursor({ x: nextLine.length - 1, y: y - 1 })
        } else if (!e.altKey) {
          setCursor({ x: x - 1, y })
        }

        return
      }
      case 'ArrowRight': {
        const currLine = children[y].lastChild.textContent
        if (x === currLine.length - 1) {
          if (y == children.length - 1) {
            return
          }
          setCursor({ x: 0, y: y + 1 })
        } else if (!e.altKey) {
          setCursor({ x: x + 1, y })
        }

        return
      }
    }
  }

  return (
    <div id="editor-container" style={editorSettings}>
      <textarea id="input-box" ref={textAreaRef} onInput={handleTextInput} onKeyDown={handleCaretMovement} autoFocus />
      <div id="editor-layout">
        position: {cursor.x + 1} {cursor.y + 1}
        <div id="editor-lines" ref={editorRef}>
          {lines.map((line, lineNr) => (
            <div key={lineNr} data-line-nr={lineNr} className="editor-line">
              <span className="editor-line-number">{lineNr}</span>
              <span className="editor-line-content" data-line-nr={lineNr} onClick={handleMouseClick}>
                {[...line].map((char, charPos) => (
                  <span
                    className="editor-line-content-char"
                    key={charPos}
                    data-char-pos={charPos}
                    data-line-nr={lineNr}
                    data-focus={cursor.x === charPos && cursor.y === lineNr}
                    onClick={handleMouseClick}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Editor
