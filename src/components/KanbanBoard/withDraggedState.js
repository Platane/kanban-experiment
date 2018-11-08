import React from 'react'
import styled from 'react-emotion'
import { FlyingItem } from './FlyingItem'
import { compose } from '../../utils/compose'
import * as columnsHelper from './columnsHelper'

const getPointer = e => ({
  x: e.clientX,
  y: e.clientY,
})

const getAncestor = fn => el =>
  !el ? null : fn(el) ? el : getAncestor(fn)(el.parentNode)

const getIndex = el =>
  Array.from(el.parentNode.children).findIndex(x => x === el)

const getItemAncestor = getAncestor(
  x => x.hasAttribute && x.hasAttribute('data-item-id')
)
const getColumnAncestor = getAncestor(
  x => x.hasAttribute && x.hasAttribute('data-column-id')
)

const getFit = e => {
  const item = getItemAncestor(e.target)

  const column = getColumnAncestor(e.target)

  if (item)
    return {
      col: getIndex(column),
      index: getIndex(item),
    }

  if (column)
    return {
      col: getIndex(column),
      index: column.children.length,
    }

  return null
}

// if there is a fit,
//    remove the item from its previous location, set a placeholder at the new location
//
// if not
//    remove the item from its previous location
//
const alterColumns = (columns, item, fit) =>
  fit
    ? compose(
        columnsHelper.removeItemById(item.id),
        columnsHelper.addItemAt(columns[fit.col].id, fit.index, {
          placeholder: true,
          id: item.id + '-placeholder',
          item,
        })
      )(columns)
    : columnsHelper.removeItemById(item.id)(columns)

const createMemoizeKey = () => {
  let key
  let previous

  return x => {
    if (x === previous) return key

    previous = x
    return (key = Math.random().toString(36))
  }
}

// lazily applie the alterColumns function,
// useful to have quick ref equals check
const createLazyAlterColumns = () => {
  const memoizeKey = createMemoizeKey()

  let previousKey = null
  let previousValue = null

  return (column, item, fit) => {
    const key =
      memoizeKey(column) +
      ':' +
      item.id +
      ':' +
      (fit ? fit.col + ':' + fit.index : '')

    if (key === previousKey) return previousValue

    previousKey = key
    return (previousValue = alterColumns(column, item, fit))
  }
}

export const withDraggedState = C =>
  class WithDraggedState extends React.Component {
    state = { origins: {} }

    alterColumns = createLazyAlterColumns()

    onStartDragging = (itemId, e) => {
      const box = e.currentTarget.getBoundingClientRect()

      const pointer = getPointer(e)

      e.stopPropagation()
      e.preventDefault()

      this.setState({
        itemId,
        anchor: { x: pointer.x - box.left, y: pointer.y - box.top },
        pointer,
        fit: getFit(e),
      })
    }

    onMove = e =>
      this.state.itemId &&
      this.setState(s => ({
        ...s,
        pointer: getPointer(e),
        fit: getFit(e),
      }))

    onUp = e => {
      const { itemId, fit, pointer, anchor } = this.state

      if (itemId) {
        if (fit && this.props.onChangePosition)
          this.props.onChangePosition(
            itemId,
            this.props.columns[fit.col].id,
            fit.index
          )

        const box = {
          left: pointer.x - anchor.x,
          top: pointer.y - anchor.y,
        }

        this.setState(({ origins }) => ({
          itemId: null,
          origins: { ...origins, [itemId]: box },
        }))
      }
    }

    componentDidMount() {
      document.addEventListener('mousemove', this.onMove)
      document.addEventListener('mouseup', this.onUp)
    }

    componentWillUnmount() {
      document.removeEventListener('mousemove', this.onMove)
      document.removeEventListener('mouseup', this.onUp)
    }

    render() {
      const { itemId, fit } = this.state

      // find the item dragged
      // if it exists
      const item =
        itemId &&
        this.props.columns.reduce(
          (item, c) => item || c.items.find(x => x.id === itemId),
          null
        )

      return (
        <React.Fragment>
          {item && <FlyingItem {...this.props} {...this.state} item={item} />}
          <C
            {...this.props}
            origins={this.state.origins}
            onStartDragging={this.onStartDragging}
            originalColumns={this.props.columns}
            columns={
              item
                ? this.alterColumns(this.props.columns, item, fit)
                : this.props.columns
            }
          />
        </React.Fragment>
      )
    }
  }
