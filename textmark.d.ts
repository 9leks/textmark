export {}

declare global {
  interface Window {
    main: {
      onReady: (cb: (lines: string[]) => void) => void
    }
  }
}
