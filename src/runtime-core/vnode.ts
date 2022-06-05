import { ShapeFlags } from "../shared/ShapeFlags"


export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null
  }

  if (typeof children === 'string'){
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }
  else if (Array.isArray(children)){
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  if((vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) && typeof children === 'object') {
    vnode.shapeFlag |= ShapeFlags.SLOTS_CHILDREN
  }

  return vnode
}

function getShapeFlag(type: any) {
  return typeof type === 'string' ?
    ShapeFlags.ELEMENT :  ShapeFlags.STATEFUL_COMPONENT
}

