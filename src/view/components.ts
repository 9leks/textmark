import InputHandler from './components/inputhandler/InputHandler'
import NumberLine from './components/interface/NumberLine'
import Statusbar from './components/interface/Statusbar'
import TextArea from './components/interface/TextArea'
import Root from './components/Root'

export default [
  { component: InputHandler, tag: 'app-inputhandler' },
  { component: NumberLine, tag: 'app-numberline' },
  { component: Statusbar, tag: 'app-statusbar' },
  { component: TextArea, tag: 'app-textarea' },
  { component: Root, tag: 'app-root' },
]
