export const isArray = (value) => {
  return Array.isArray(value)
}

export const isString = (value) => {
  return typeof value === 'string' || value instanceof String
}

export default {
  isArray,
  isString
}
