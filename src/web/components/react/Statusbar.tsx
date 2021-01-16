import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'
import React, { FunctionComponent, useContext } from 'react'
import { StoreContext } from '../../index'

const Statusbar: FunctionComponent = () => {
  const { x, y } = useContext(StoreContext)

  return (
    <Container>
      <Coordinates>
        {x + 1}:{y + 1}
      </Coordinates>
    </Container>
  )
}

export default observer(Statusbar)

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0.25em 1em;
  background-color: #00000003;
  box-shadow: inset 0 0 2px #0003;
  font-family: 'SF Mono', 'Courier New', monospace;
  justify-self: center;
  font-size: 0.75em;
`

const Coordinates = styled.div``
