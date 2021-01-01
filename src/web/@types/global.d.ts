declare interface Window {
  api: {
    onReady: (send: (payload: Payload) => void) => void
    os: () => string
  }
}

declare namespace JSX {
  interface XTextAreaProps {
    ref: React.MutableRefObject<import('../components/web/x-textarea').default>
    value: string
    'font-size': string
    'font-family': string
    'line-height': string
    x: number
    y: number
  }

  interface IntrinsicElements {
    'x-textarea': XTextAreaProps
  }
}
