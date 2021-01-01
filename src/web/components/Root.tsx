import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useContext } from 'react'
import { StoreContext } from '../index'
import { TextArea } from './react/components'

const Root: FunctionComponent = () => {
  const store = useContext(StoreContext)
  const { x, y, text } = store

  const handleChange = (e: CustomEvent<XInputEvent>): void => {
    const { value, x, y } = e.detail
    store.setText(value)
    store.setCoords(x, y)
  }

  return (
    <div>
      <TextArea
        value={text}
        onChange={handleChange}
        x={y}
        y={x}
        lineHeight="28px"
        fontSize="16px"
        fontFamily="'SF Mono', 'Courier New', monospace"
      />
    </div>
  )
}

export default observer(Root)
