
import { createVNode } from "./vnode";

export function h (type: any, props?: any, children?: any) {

  // 创建虚拟节点
  const vnode = createVNode(type, props, children)

  return vnode
}