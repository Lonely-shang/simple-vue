import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/ShapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppApi } from "./createApp"
import { h } from "./h"
import { Fargment, Text } from "./vnode"

export function createRenderer ( options: any ) {

  const {
    createElement,
    pathProps,
    insert
  } = options

  // 将虚拟节点渲染到真实dom
  function render (vnode, container, parentComponent = {}) {
    // patch
    path(vnode, container, parentComponent)
  }

  function path(vnode, container, parentComponent) {
    const { type, shapeFlag } = vnode
    // 处理组件
    /**
     * 通过vnode.type判断是否是组件
     */
      switch (type) {
        case Fargment:
          processFargment(vnode, container, parentComponent);
          break;
        case Text:
          processText(vnode, container);
          break;
        default:
          if(shapeFlag & ShapeFlags.ELEMENT) {
            processElement(vnode, container, parentComponent)
          }
          // 若type类型是object 则说明vnode是组件类型 调用processComponent处理组件
          else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
            processComponent(vnode, container, parentComponent)
          }
          break;
      }
  }

  function processFargment(vnode: any, container: any, parentComponent: any) {
    mountChildren(vnode, container, parentComponent)
  }

  function processText(vnode: any, container: any) {
    const { children } = vnode

    const el = document.createTextNode(children)

    container.appendChild(el)
  }


  function processElement(vnode: any, container: any, parentComponent: any) {
    mountElement(vnode, container, parentComponent)
  }

  function mountElement(vnode: any, container: any, parentComponent: any) {
    // canvas

    const { type, props, children, shapeFlag } = vnode

    const el = createElement(type)

    vnode.el = el;

    if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    }
    else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent)
    }

    for (const key in props) {
      const val = props[key]
      // const isOn = (key: string) => /^on[A-Z]/.test(key)
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase()
      //   el.addEventListener(event, _key)
      // }
      // else {
      //   el.setAttribute(key, _key)
      // }
      pathProps(el, key, val)
    }

    insert(el, container)
    // container.appendChild(el)

  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.map(v => path(v, container, parentComponent))
  }

  function processComponent(vnode: any, container: any, parentComponent: any) {
    // 挂载组件
    mountComponent(vnode, container, parentComponent)
  }

  function mountComponent(initialVnode: any, container: any, parentComponent: any) {
    const instance = createComponentInstance(initialVnode, parentComponent)

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
    path(subTree, container, instance)

    initialVnode.el = subTree.el
  }

  return {
    createApp: createAppApi(render)
  }
}