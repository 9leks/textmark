export function isLine(line: TextAreaElement): line is LineElement {
  return (line as LineElement)['app-offset-y'] !== undefined
}

export function isChunk(chunk: TextAreaElement): chunk is ChunkElement {
  return (chunk as ChunkElement)['app-offset-x'] !== undefined
}
