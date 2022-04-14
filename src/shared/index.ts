export const extend = Object.assign;

export function isObject(obj: unknown){
  return obj instanceof Object && obj !== null
}