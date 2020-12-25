interface Window {
  api: {
    onReady: (send: (payload: { lines: string[]; cursor: { x: number; y: number } }) => void) => void
    os: () => string
  }
}
