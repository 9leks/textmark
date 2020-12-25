import { action, makeObservable, observable } from "mobx"

class Text {
  lines: string[] = []

  constructor() {
    makeObservable(this, {
      lines: observable,
      set: action,
      insertAt: action,
    })
  }

  set(lines: string[]): void {
    this.lines = lines
  }

  insertAt(item: string, y: number, x: number) {
    this.lines[y] = this.lines[y].slice(0, x) + item + this.lines[y].slice(x)
  }
}

class Cursor {
  x = 0
  y = 0

  constructor() {
    makeObservable(this, {
      x: observable,
      y: observable,
      set: action,
    })
  }

  set(x: number, y: number): void {
    this.x = x
    this.y = y
  }
}

export const text = new Text()
export const cursor = new Cursor()
