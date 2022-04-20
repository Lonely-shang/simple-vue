export const extend = Object.assign;

export function isObject(obj: unknown){
  return obj instanceof Object && obj !== null
}

export function hasChanged(value, oldValue) {
  return !Object.is(value, oldValue);
}