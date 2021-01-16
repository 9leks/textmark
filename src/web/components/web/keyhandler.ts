import XTextArea from './x-textarea'

export function handleKeyDown(this: XTextArea, e: KeyboardEvent): void {
  console.log('hi')
  if (['Control', 'Alt', 'Meta', 'CapsLock', 'Shift'].includes(e.key)) {
    return
  }

  if (!(window.api.os() === 'darwin' ? e.metaKey : e.ctrlKey)) {
    const inputHandler = this.shadowRoot.querySelector<HTMLTextAreaElement>('.input')
    inputHandler.focus({ preventScroll: true })
  }

  const { x, y, lines } = this

  switch (e.key) {
    case 'Enter': {
      if (x === 0) {
        this.y = y + 1
        this.lines = [...lines.slice(0, y), '', ...lines.slice(y)]
        break
      }

      if (x === lines[y].length) {
        this.x = 0
        this.y = y + 1
        this.lines = [...lines.slice(0, y + 1), '', ...lines.slice(y + 1)]
        break
      }

      this.x = 0
      this.y = y + 1
      this.lines = [...lines.slice(0, y), lines[y].slice(0, x), lines[y].slice(x), ...lines.slice(y + 1)]
      break
    }
    case 'Backspace': {
      if (x === 0) {
        if (y === 0) {
          break
        }

        this.x = lines[y - 1].length
        this.y = y - 1
        this.lines = [...lines.slice(0, y - 1), lines[y - 1] + lines[y], ...lines.slice(y + 1)]
        break
      }

      this.x = x - 1
      this.lines = [...lines.slice(0, y), lines[y].slice(0, x - 1) + lines[y].slice(x), ...lines.slice(y + 1)]
      break
    }
    case 'Delete': {
      if (y === lines.length - 1 && x === lines[y].length) {
        break
      }

      if (x === lines[y].length) {
        this.lines = [...lines.slice(0, y), lines[y] + lines[y + 1], ...lines.slice(y + 2)]
        break
      }

      this.lines = [...lines.slice(0, y), lines[y].substring(0, x) + lines[y].substring(x + 1), ...lines.slice(y + 1)]
      break
    }
    case 'Home': {
      this.x = 0
      break
    }
    case 'End': {
      this.x = lines[y].length
      break
    }
    case 'PageUp': {
      this.x = 0
      this.y = 0
      break
    }
    case 'PageDown': {
      this.x = lines[lines.length - 1].length
      this.y = lines.length - 1
      break
    }
    case 'ArrowLeft': {
      if (x === 0) {
        if (y === 0) {
          break
        }
        this.x = lines[y - 1].length
        this.y = y - 1
        break
      } else if (e.altKey || e.ctrlKey) {
        this.x = lines[y].lastIndexOf(' ', x - 2) + 1
        break
      }
      this.x = x - 1
      break
    }
    case 'ArrowRight': {
      if (x === lines[y].length) {
        if (y === lines.length - 1) {
          break
        }
        this.x = 0
        this.y = y + 1
        break
      } else if (e.altKey || e.ctrlKey) {
        const index = lines[y].indexOf(' ', x) + 1
        if (index > 0) {
          this.x = index
        } else {
          this.x = lines[y].length
        }
        break
      }
      this.x = x + 1
      break
    }
    case 'ArrowUp': {
      if (y === 0) {
        break
      }

      if (e.altKey || e.ctrlKey) {
        this.y = y - 1
        this.lines = [...lines.slice(0, y - 1), lines[y], lines[y - 1], ...lines.slice(y + 1)]
        break
      }

      this.x = lines[y - 1].length >= x ? x : lines[y - 1].length
      this.y = y - 1
      break
    }
    case 'ArrowDown': {
      if (y === lines.length - 1) {
        break
      }

      if (e.altKey || e.ctrlKey) {
        this.y = y + 1
        this.lines = [...lines.slice(0, y), lines[y + 1], lines[y], ...lines.slice(y + 2)]
      }

      this.x = lines[y + 1].length >= x ? x : lines[y + 1].length
      this.y = y + 1
      break
    }
  }
}
