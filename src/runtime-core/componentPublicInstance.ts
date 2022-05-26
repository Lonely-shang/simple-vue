
const publicPropertiesMap = {
  $el: (i) => i.vnode.el
}

export const PublicInstanceProxyHandlers = {
  get ({ _: instance }, key) {
    if(key in instance.setupState) {
      return instance.setupState[key]
    }

    const publicGetter = publicPropertiesMap[key]
    // 验证publicGetter是否存在
    if(publicGetter) {
      return publicGetter(instance)
    }
  }
}