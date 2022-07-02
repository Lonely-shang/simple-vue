import { createVNode } from "./vnode"

export function createAppApi ( render: any ) {
  return function createApp(rootComponent) {
    return {
      mount(domId: string) {
        const rootContainer = document.querySelector(domId)
        if (!rootContainer) {
          throw new Error(`找不到指定的dom元素: ${domId}`)
        }
        // 先将根组件转化成虚拟节点
        const vnode = createVNode(rootComponent)
        // 渲染节点
        render(vnode, rootContainer)
      }
    }
  }
}






