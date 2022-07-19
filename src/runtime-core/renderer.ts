import { effect } from "../reactivity"
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
    path(null, vnode, container, parentComponent)
  }

  function path(oldVnode, newVnode, container, parentComponent) {
    const { type, shapeFlag } = newVnode
    // 处理组件
    /**
     * 通过vnode.type判断是否是组件
     */
      switch (type) {
        case Fargment:
          processFargment(oldVnode, newVnode, container, parentComponent);
          break;
        case Text:
          processText(oldVnode, newVnode, container);
          break;
        default:
          if(shapeFlag & ShapeFlags.ELEMENT) {
            processElement(oldVnode, newVnode, container, parentComponent)
          }
          // 若type类型是object 则说明vnode是组件类型 调用processComponent处理组件
          else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
            processComponent(oldVnode, newVnode, container, parentComponent)
          }
          break;
      }
  }

  function processFargment(oldVnode, newVnode: any, container: any, parentComponent: any) {
    mountChildren(newVnode, container, parentComponent)
  }

  function processText(oldVnode, newVnode: any, container: any) {
    const { children } = newVnode

    const el = document.createTextNode(children)

    container.appendChild(el)
  }


  function processElement(oldVnode: any, newVnode: any, container: any, parentComponent: any) {
    if (!oldVnode) {
      mountElement(newVnode, container, parentComponent)
    }else {
      patchElement(oldVnode, newVnode, container)
    }
  }

  function patchElement(oldVnode: any, newVnode: any, container: any) {
    console.log('oldVnode', oldVnode);
    console.log('newVnode', newVnode);
    console.log('container', container);

    // update props
    const oldProps = oldVnode.props || {}
    const newProps = newVnode.props || {}

    const el = (newVnode.el = oldVnode.el)

    patchProps(el, oldProps, newProps)
    // update Element
  }

  function patchProps(el, oldProps: any, newProps: any) {
    for (const key in newProps) {
      const prevProp = oldProps[key]
      const nextProp = newProps[key]

      if (prevProp !== nextProp) {
        pathProps(el, key, prevProp, nextProp);
      }
    }
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
      pathProps(el, key, null, val)
    }

    insert(el, container)
    // container.appendChild(el)

  }

  function mountChildren(vnode, container, parentComponent) {
    vnode.children.map(v => path(null, v, container, parentComponent))
  }

  function processComponent(oldVnode, newVnode: any, container: any, parentComponent: any) {
    // 挂载组件
    mountComponent(newVnode, container, parentComponent)
  }

  function mountComponent(initialVnode: any, container: any, parentComponent: any) {
    const instance = createComponentInstance(initialVnode, parentComponent)

    setupComponent(instance)

    setupRenderEffect(instance, initialVnode, container)
  }

  function setupRenderEffect(instance: any, initialVnode: any, container: any) {

    effect(() => {
      if (!instance.isMounted) {
        console.log('init');

        const { proxy } = instance

        // render函数
        const subTree = (instance.subTree = instance.render.bind(proxy)(h))

        // TODO
        // 可能是templete

        // vnode -> path
        // vnode -> element -> mountElement
        path(null, subTree, container, instance)

        initialVnode.el = subTree.el

        instance.isMounted = !instance.isMounted
      }else {
        console.log('update');

        const { proxy } = instance

        // render函数
        const subTree = instance.render.bind(proxy)(h)
        const prevSubTree = instance.subTree;

        instance.subTree = subTree;
        console.log('currentSubTree', subTree);
        console.log('prevSubTree', prevSubTree);


        path(prevSubTree, subTree, container, instance)

      }
    })
  }

  return {
    createApp: createAppApi(render)
  }
}