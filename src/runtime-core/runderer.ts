import { isObject } from "../shared/index"
import { createComponentInstance, setupComponent } from "./component"
import { h } from "./h"

// 将虚拟节点渲染到真实dom
export function render(vnode, container) {
  // patch

  path(vnode, container)
}

function path(vnode, container) {
  // 处理组件
  /**
   * 通过vnode.type判断是否是组件
   */
    if(typeof vnode.type === "string") {
      processElement(vnode, container)
    }
    // 若type类型是object 则说明vnode是组件类型 调用processComponent处理组件
    else if(isObject(vnode.type)) {
      processComponent(vnode, container)
    }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
  const { type, props, children } = vnode

  const el = document.createElement(type);

  vnode.el = el;

  if(typeof children === "string") {
    el.textContent = children
  }else if(Array.isArray(children)) {
    mountChildren(vnode, el)
  }

  for (const key in props) {
    el.setAttribute(key, props[key])
  }

  container.appendChild(el)

}

function mountChildren(vnode, container) {
  vnode.children.map(v => path(v, container))
}

function processComponent(vnode: any, container: any) {
  // 挂载组件
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode)

  setupComponent(instance)

  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance: any, vnode: any, container: any) {

  const { proxy } = instance

  // render函数
  const subTree = instance.render.bind(proxy)(h)

  // TODO
  // 可能是templete

  // vnode -> path
  // vnode -> element -> mountElement
  path(subTree, container)

  vnode.el = subTree.el
}
