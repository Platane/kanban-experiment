import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'react-emotion'

const getFlyingStyle = ({ pointer, anchor }) => ({
  transform: `translate3d(${pointer.x - anchor.x}px,${pointer.y -
    anchor.y}px,0)`,
})

export const FlyingItem = props => (
  <Container style={getFlyingStyle(props)}>
    {React.createElement(props.GhostItem, props.item)}
  </Container>
)

const Container = styled.div`
  position: absolute;
  z-index: 10;
  top: 0;
  left: 0;
  pointer-events: none;
`
