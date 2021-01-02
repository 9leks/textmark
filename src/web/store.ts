import { makeAutoObservable } from 'mobx'

class Store {
  constructor() {
    makeAutoObservable(this)
  }

  text = ''
  lineCount = 0
  x = 0
  y = 0
  conf = {
    lineHeight: '28px',
    fontSize: '16px',
    fontFamily: "'SF Mono', 'Courier New', monospace",
  }

  setText(text: string): void {
    this.text = text
    this.lineCount = (text.match(/\n/g) || '').length + 1
  }

  setCoords(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}

export default new Store()
