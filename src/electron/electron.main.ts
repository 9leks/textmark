import { ElectronWindow } from "./electron.window"

function onClose() {
  console.log("Textmark closed!")
}

ElectronWindow.whenReady({
  url: "http://localhost:8000/",
  devTools: true,
  onClose,
})
