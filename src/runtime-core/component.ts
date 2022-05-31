import { shallowReadonly } from "../reactivity/reactive"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {}
  }

  return component
}

export function setupComponent(instance: any) {
  // TODO
  // 初始化props
  initProps(instance, instance.vnode.props)

  // 初始化slots

  //
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {

  const { setup } = instance.type

  // 设置代理对象
  instance.proxy = new Proxy({ _ : instance}, PublicInstanceProxyHandlers)

  if(setup) {
    const setupResult = setup(shallowReadonly(instance.props))
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

