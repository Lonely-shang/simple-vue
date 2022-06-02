

export function emit (instance, event) {

  const { props } = instance

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const toHandlerKey = (key: string) => {
    return `on${capitalize(key)}`
  }

  const handler = props[toHandlerKey(event)]

  handler && handler();
}