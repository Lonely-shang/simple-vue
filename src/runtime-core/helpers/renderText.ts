import { createVNode, Text } from "../vnode";

export function renderText(str: string) {
  return createVNode(Text, {}, str)
}