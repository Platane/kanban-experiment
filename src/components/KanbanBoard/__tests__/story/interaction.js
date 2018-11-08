import React from 'react'
import styled, { css } from 'react-emotion'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { Column, Item, GhostItem, PlaceholderItem, columns } from './common'

import { KanbanBoard } from '../../index'

storiesOf('KanbanBoard', module).add('simple interaction', () => (
  <KanbanBoard
    columns={columns}
    Item={Item}
    Column={Column}
    GhostItem={GhostItem}
    PlaceholderItem={PlaceholderItem}
    onChangePosition={action('change position')}
    animationDuration={180}
  />
))
