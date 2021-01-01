import { contextBridge } from 'electron'

const dummy = {
  lines: [
    'Hello. What is your name?',
    'An African elephant can weigh as much as 6 tons!',
    "What's the definition of a long sentence? For my purposes, I'm defining it as more than a 100 words. I’ve cheated with a few beautiful sentences a few words short, because there is no sense in having an absolute and arbitrary rule, but more than 100 words was my guiding principle. I think any sentence more than 100 words is almost guaranteed to be complex, complicated, and enormous.",
    'Empty line below',
    '',
    'Empty line above',
    'A double empty line!',
    '',
    '',
    "Some simple sentences have a single subject and verb, but the subject isn't stated in the sentence. Instead, the reader knows who the subject is from context.",
  ],
  coords: { x: 0, y: 0 },
}

contextBridge.exposeInMainWorld('api', {
  onReady: (send: (payload: { text: string; coords: { x: number; y: number } }) => void) => {
    const payload = { text: dummy.lines.join('\n'), coords: dummy.coords }
    send(payload)
  },
  os: (): string => process.platform,
})
