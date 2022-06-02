import { camelize, toHandlerKey } from "../shared/index";


export function emit (instance, event, ...args: any[]) {

  const { props } = instance

  const handlerKey = toHandlerKey(camelize(event))
  const handler = props[handlerKey]

  handler && handler(...args);
}