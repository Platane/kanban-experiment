import React from 'react'
// import { Column, Item } from './type'
import { KanbanBoard as Dumb } from './Dumb'
import { withDraggedState } from './withDraggedState'

export const KanbanBoard = withDraggedState(Dumb)
