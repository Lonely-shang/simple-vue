import { createVNode } from "./vnode"

export function createAppApi ( render: any ) {
  return function createApp(rootComponent) {
    return {
      mount(container: Element | string) {
        let rootContainer: Element | null = null
        if (typeof container == 'string') {
          rootContainer = document.querySelector(container)
        }else {
          rootContainer = container
        }
        if (!rootContainer) {
          throw new Error(`找不到指定的dom元素: ${container}`)
        }
        // 先将根组件转化成虚拟节点
        const vnode = createVNode(rootComponent)
        // 渲染节点
        render(vnode, rootContainer)
      }
    }
  }
}






