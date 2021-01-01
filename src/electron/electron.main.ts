import { whenReady } from './electron.window'

function onClose(): void {
  console.log('Textmark closed!')
}

await whenReady({
  url: 'http://localhost:8000/',
  devTools: true,
  onClose,
})
