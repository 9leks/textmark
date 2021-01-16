export function isLine(line: HTMLDivElement): line is LineElement {
  return (line as LineElement).posY !== undefined
}