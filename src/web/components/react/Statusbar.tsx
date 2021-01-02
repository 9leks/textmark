import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useContext } from 'react'
import { StoreContext } from '../../index'

const Statusbar: FunctionComponent = () => {
  const { x, y } = useContext(StoreContext)

  return (
    <Container>
      <span>
        {x}:{y}
      </span>
    </Container>
  )
}

export default observer(Statusbar)

const Container = styled.div`
  padding: 0.25em 0.5em 0.25em 0.5em;
  background-color: #0001;
  box-shadow: inset 0 0 2px #0003;
  font-family: 'SF Mono', 'Courier New', monospace;
  justify-self: center;
`
