import React from 'react'
import styled from 'react-emotion'

type Id = string

export type Item = { id: Id }

export type Column = {
  id: Id
  title: string
  color: string
  items: Item[]
}
