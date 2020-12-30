interface Window {
  api: {
    onReady: (send: (payload: { lines: string[]; coords: { x: number; y: number } }) => void) => void
    os: () => string
  }
}
