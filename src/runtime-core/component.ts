
export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type
  }

  return component
}

export function setupComponent(instance: any) {
  // TODO
  // 初始化props
  // 初始化slots

  //
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {

  const { setup } = instance.vnode.type
  if(setup) {
    const setupResult = setup()
    handlerSetupResult(instance, setupResult)
  }
}

function handlerSetupResult(instance: any, setupResult: any) {
  // 这里传过来的setupResult可能是个函数或对象

  if(typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  // TODO
  // 如果是函数，则当成render函数渲染

  finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
  const Component = instance.type

  // if(Component.render) {
    instance.render = Component.render
  // }
}

