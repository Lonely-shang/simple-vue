import { createComponentInstance, setupComponent } from "./component"

// 将虚拟节点渲染到真实dom
export function render(vnode, container) {
  // patch

  path(vnode, container)
}

function path(vnode, container) {
  // 处理组件

  // 判断是否是 element
  processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {

  // 挂载组件
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)

  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render()

  // vnode -> path
  // vnode -> element -> mountElement
  path(subTree, container)
}

