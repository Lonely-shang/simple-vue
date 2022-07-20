export const extend = Object.assign;

export const EMIT_OBJ = {};

export function isObject(obj: unknown){
  return obj instanceof Object && obj !== null
}

export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue);
}

export const hasOwn = (value: any, key: string) => Object.prototype.hasOwnProperty.call(value, key)

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (all, letter: string) => {
    return letter ? letter.toUpperCase() : ''
  })
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const toHandlerKey = (key: string) => {
  return `on${capitalize(key)}`
}