import React from 'react'
import { Column, Item, GhostItem, PlaceholderItem, columns } from './common'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { KanbanBoard as DumbKanbanBoard } from '../../Dumb'

const shuffle = columns => {
  const i =
    columns.findIndex(x => x.items.length > 1) ||
    columns.findIndex(x => x.items.length)

  if (i === -1) return columns

  const k = Math.floor(Math.random() * columns.length)

  const copy = columns.map(column => ({
    ...column,
    items: column.items.slice(),
  }))

  copy[k].items.push(copy[i].items.shift())

  return copy
}

class KanbanBoardAnimated extends React.Component {
  state = { columns: this.props.columns }

  componentDidMount() {
    // this._timeout = setTimeout(
    this._timeout = setInterval(
      () => this.setState(({ columns }) => ({ columns: shuffle(columns) })),
      this.props.suffleDelay
    )
  }

  componentWillUnmount() {
    clearInterval(this._timeout)
  }

  render() {
    return (
      <DumbKanbanBoard
        {...this.props}
        columns={this.state.columns}
        _key={Math.random()}
        Item={Item}
        Column={Column}
        GhostItem={GhostItem}
        PlaceholderItem={PlaceholderItem}
      />
    )
  }
}

storiesOf('KanbanBoard', module)
  .add('animation simple', () => (
    <KanbanBoardAnimated
      animationDuration={3000}
      suffleDelay={3500}
      columns={columns.slice(0, 2)}
    />
  ))
  .add('animation cancelation', () => (
    <KanbanBoardAnimated
      animationDuration={4000}
      suffleDelay={2000}
      columns={columns.slice(0, 2)}
    />
  ))
  .add('animation plenty', () => (
    <KanbanBoardAnimated
      animationDuration={180}
      suffleDelay={300}
      columns={columns}
    />
  ))
