import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { h } from "./h"

// 将虚拟节点渲染到真实dom
export function render(vnode, container) {
  // patch

  path(vnode, container)
}

function path(vnode, container) {
  const { type, shapeFlag } = vnode
  // 处理组件
  /**
   * 通过vnode.type判断是否是组件
   */
    switch (type) {
      case "Fargment":
        processFargment(vnode, container);
        break;
    
      default:
        if(shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container)
        }
        // 若type类型是object 则说明vnode是组件类型 调用processComponent处理组件
        else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container)
        }
        break;
    }
}

function processFargment(vnode: any, container: any) {
  mountChildren(vnode, container)
}


function processElement(vnode: any, container: any) {
  mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
  const { type, props, children, shapeFlag } = vnode

  const el = document.createElement(type);

  vnode.el = el;

  if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  }
  else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el)
  }

  for (const key in props) {
    const _key = props[key]
    const isOn = (key: string) => /^on[A-Z]/.test(key)
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event, _key)
    }
    else {
      el.setAttribute(key, _key)
    }
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

function mountComponent(initialVnode: any, container: any) {
  const instance = createComponentInstance(initialVnode)

  setupComponent(instance)

  setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect(instance: any, initialVnode: any, container: any) {

  const { proxy } = instance

  // render函数
  const subTree = instance.render.bind(proxy)(h)

  // TODO
  // 可能是templete

  // vnode -> path
  // vnode -> element -> mountElement
  path(subTree, container)

  initialVnode.el = subTree.el
}
