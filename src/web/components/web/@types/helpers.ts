export function isLine(line: Element): line is LineElement {
  return line && (line as LineElement).posY !== undefined
}