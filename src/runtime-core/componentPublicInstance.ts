
const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}

const hasOwn = (value: any, key: string) => Object.prototype.hasOwnProperty.call(value, key)

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