import React from 'react'
import styled, { css } from 'react-emotion'

const copyBox = ({ left, top, width, height }) => ({ left, top, width, height })

const boxEquals = (a, b) =>
  a.left === b.left &&
  a.top === b.top &&
  a.width === b.width &&
  a.height === b.height

const transformDiff = (b, a) => ({
  transform: `translate3d(${b.left - a.left}px,${b.top - a.top}px,0)`,
})

const idleTransform = {
  transform: 'translate3d(0,0,0)',
}

// animation cannot be natively retreive from the element
// keep a ref here
const createAnimationStore = () => {
  const m = new Map()

  const set = (el, animation) => m.set(el, animation)
  const get = el => m.get(el)
  const cancel = el => {
    const a = get(el)
    a && a.cancel()
    m.delete(el)
  }

  return { set, get, cancel }
}

const animationStore = createAnimationStore()

export class KanbanBoard extends React.Component {
  rootRef = React.createRef()

  state = { phase: 'stable', _key: null }

  static defaultProps = {
    animationDuration: 400,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.columns === prevState._key) return {}

    return { phase: 'firstPass', _key: nextProps.columns }
  }

  // return dom elements representing the items
  getItemElements = () =>
    Array.from(this.rootRef.current.querySelectorAll('[data-item-id]')).map(
      el => {
        const itemId = el.getAttribute('data-item-id')

        return { itemId, el: el.children[0] }
      }
    )

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.columns !== this.props.columns ||
      nextState.phase !== this.state.phase
    )
  }

  getSnapshotBeforeUpdate() {
    if (this.state.phase !== 'firstPass') return {}

    const boxes = {}

    this.getItemElements().forEach(
      ({ el, itemId }) => (boxes[itemId] = copyBox(el.getBoundingClientRect()))
    )

    return boxes
  }

  componentDidUpdate(prevProps, prevState, prevBoxes) {
    switch (this.state.phase) {
      case 'stable':
        return

      case 'firstPass': {
        const transform = {}

        const els = this.getItemElements()

        // cancel all animation
        els.forEach(({ el }) => animationStore.cancel(el))

        // compare starting and last position
        els.forEach(({ el, itemId }) => {
          const box = copyBox(el.getBoundingClientRect())

          const prevBox = prevBoxes[itemId]

          if (!prevBox) {
            // animate in
            //
            if (this.props.origins[itemId])
              transform[itemId] = transformDiff(this.props.origins[itemId], box)
          } else if (!boxEquals(prevBox, box)) {
            // animate transition
            //
            transform[itemId] = transformDiff(prevBox, box)
          }
        })

        this.setState({ phase: 'secondPass', transform })

        return
      }

      case 'secondPass': {
        this.getItemElements().forEach(({ el, itemId }) => {
          const transform = this.state.transform[itemId]

          animationStore.cancel(el)

          if (transform) {
            const animation = el.animate([transform, idleTransform], {
              duration: this.props.animationDuration,
              easing: 'linear',
            })

            animationStore.set(el, animation)
          }
        })

        return
      }
    }
  }

  render() {
    const { Item, PlaceholderItem, Column } = this.props

    return (
      <div ref={this.rootRef} className={containerCss}>
        {this.props.columns.map(column => (
          <Column key={column.id} data-column-id={column.id} {...column}>
            {column.items.map(item => (
              //
              <ItemWrapper
                key={item.id}
                data-item-id={item.id}
                onMouseDown={
                  this.props.onStartDragging &&
                  (e => this.props.onStartDragging(item.id, e))
                }
              >
                {item.placeholder ? (
                  <PlaceholderItem key={item.id} {...item.item} />
                ) : (
                  <Item key={item.id} {...item} />
                )}
              </ItemWrapper>
            ))}
          </Column>
        ))}
      </div>
    )
  }
}

const ItemWrapper = styled.div`
  /* box-shadow: 0 0 10px orange; */

  & > * {
    pointer-events: none;
  }
`

const containerCss = css`
  display: flex;
  flex-direction: row;
  margin: 0;
  position: relative;
`
