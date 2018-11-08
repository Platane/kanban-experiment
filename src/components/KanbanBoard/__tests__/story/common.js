import React from 'react'

export const columns = [
  {
    id: 20,
    items: [{ id: 2, color: 'red' }, { id: 3, color: 'blue' }],
  },
  {
    id: 30,
    items: [],
  },
  {
    id: 10,
    items: [
      { id: 5, color: 'yellow' },
      { id: 7, color: 'green' },
      { id: 6, color: 'purple' },
      { id: 8, color: 'limegreen' },
    ],
  },
  {
    id: 40,
    items: [],
  },
]

export const Item = ({ color }) => (
  <div style={{ backgroundColor: color, height: '100px', width: '100px' }} />
)
export const GhostItem = props => (
  <div style={{ opacity: 0.4 }}>
    <Item {...props} />
  </div>
)
export const PlaceholderItem = props => (
  <div style={{ opacity: 0.05 }}>
    <Item {...props} />
  </div>
)
export const Column = ({ items, children, ...props }) => (
  <section
    {...props}
    style={{
      margin: '10px',
      padding: '10px',
      flex: 'auto 0 0',
      minWidth: '100px',
      backgroundColor: '#eee',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <header style={{ textAlign: 'center', padding: '10px' }}>
      {items.length}
    </header>

    <div>{children}</div>

    <header style={{ marginTop: 'auto', textAlign: 'center', padding: '10px' }}>
      {items.length}
    </header>
  </section>
)
