import { makeAutoObservable } from 'mobx'

class Store {
  constructor() {
    makeAutoObservable(this)
  }

  lines: string[] = []
  x: number = 0
  y: number = 0

  setLines(lines: string[]) {
    this.lines = lines
  }

  setCoords(x: number, y: number) {
    this.x = x
    this.y = y
  }
}

export default new Store()
