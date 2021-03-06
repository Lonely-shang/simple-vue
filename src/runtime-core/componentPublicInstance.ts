import { hasOwn } from "../shared/index"

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots
}

export const PublicInstanceProxyHandlers = {
  get ({ _: instance }, key) {
    const { setupState, props } = instance

    if(hasOwn(setupState, key)) {
      return setupState[key]
    }
    else if(hasOwn(props, key)) {
      return props[key]
    }

    const publicGetter = publicPropertiesMap[key]
    // 验证publicGetter是否存在
    if(publicGetter) {
      return publicGetter(instance)
    }
  }
}