export function isLine(line: TextAreaElement): line is LineElement {
  return (line as LineElement).posY !== undefined
}

export function isChunk(chunk: TextAreaElement): chunk is ChunkElement {
  return (chunk as ChunkElement).posX !== undefined
}
