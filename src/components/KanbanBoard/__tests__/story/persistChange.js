import React from 'react'
import styled, { css } from 'react-emotion'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { Column, Item, GhostItem, PlaceholderItem, columns } from './common'

import { KanbanBoard } from '../../index'

class KanbanBoardStateful extends React.Component {
  state = { columns: this.props.columns }

  onChangePosition = (itemId, columnId, order) =>
    this.setState(({ columns }) => {
      const item = columns.reduce(
        (item, c) => item || c.items.find(x => x.id === itemId),
        null
      )

      if (!item) return

      return {
        columns: columns.map(column => {
          const items = column.items.filter(x => x.id !== itemId)

          if (column.id === columnId) items.splice(order, 0, item)

          return {
            ...column,
            items,
          }
        }),
      }
    })

  render() {
    return (
      <KanbanBoard
        {...this.props}
        {...this.state}
        onChangePosition={this.onChangePosition}
      />
    )
  }
}

storiesOf('KanbanBoard', module).add('stateful', () => (
  <KanbanBoardStateful
    columns={columns}
    Item={Item}
    Column={Column}
    GhostItem={GhostItem}
    PlaceholderItem={PlaceholderItem}
    animationDuration={120}
  />
))
