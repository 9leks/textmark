import { makeAutoObservable } from 'mobx'

class Store {
  constructor() {
    makeAutoObservable(this)
  }

  text = ''
  x = 0
  y = 0

  setText(text: string): void {
    this.text = text
  }

  setCoords(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}

export default new Store()
