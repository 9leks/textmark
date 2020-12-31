import { makeAutoObservable } from 'mobx'

class Store {
  constructor() {
    makeAutoObservable(this)
  }

  lines: string[] = []
  x: number = 0
  y: number = 0

  setLines(lines: string[]): void {
    this.lines = lines
  }

  setCoords(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}

export default new Store()
