import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useContext } from 'react'
import { StoreContext } from '../index'
import { TextArea, Statusbar } from './react/components'

const Root: FunctionComponent = () => {
  const store = useContext(StoreContext)

  const handleInput = (e: CustomEvent<XInputEvent>): void => {
    const { value, x, y } = e.detail
    store.setText(value)
    store.setCoords(x, y)
  }

  return (
    <Container>
      <TextArea onInput={handleInput} />
      <Statusbar />
    </Container>
  )
}

export default observer(Root)

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`
