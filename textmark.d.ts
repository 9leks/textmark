export {}

declare global {
  interface Window {
    main: {
      onReady: (cb: (file: string, contents: string[]) => void) => void
    }
  }
}
