declare interface Window {
  api: {
    onReady: (send: (payload: { text: string; coords: { x: number; y: number } }) => void) => void
    os: () => string
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'x-textarea': XTextAreaProps
  }
}
