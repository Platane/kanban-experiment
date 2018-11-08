export const removeItem = selector => columns =>
  columns.map(column => ({
    ...column,
    items: column.items.filter(x => !selector(x)),
  }))

export const addItemAt = (columnId, index, item) => columns =>
  columns.map(column => {
    if (column.id !== columnId) return column

    const items = column.items.slice()

    items.splice(index, 0, item)

    return {
      ...column,
      items,
    }
  })

export const mapItem = mapper => columns =>
  columns.map(column => ({
    ...column,
    items: items.map(mapper),
  }))

export const removeItemById = id => removeItem(x => x.id === id)

export const setItem = (id, item) => mapItem(x => (id === x.id ? item : x))
