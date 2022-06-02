

export function emit (instance, event, ...args: any[]) {

  const { props } = instance

  const camelize = (str: string) => {
    return str.replace(/-(\w)/g, (all, letter: string) => {
      return letter ? letter.toUpperCase() : ''
    })
  }

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const toHandlerKey = (key: string) => {
    return `on${capitalize(key)}`
  }

  const handlerKey = toHandlerKey(camelize(event))
  const handler = props[handlerKey]

  handler && handler(...args);
}