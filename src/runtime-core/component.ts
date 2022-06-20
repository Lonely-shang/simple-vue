import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { PublicInstanceProxyHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
    slots: {},
    emit: () => {},
  }

  component.emit = emit.bind(null, component) as any

  return component
}

export function setupComponent(instance: any) {
  // TODO
  // 初始化props
  initProps(instance, instance.vnode.props)

  // 初始化slots
  initSlots(instance, instance.vnode.children)
  //
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance: any) {

  const { setup } = instance.type

  // 设置代理对象
  instance.proxy = new Proxy({ _ : instance}, PublicInstanceProxyHandlers)

  if(setup) {
    currentInstance = instance
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit
    })
    handlerSetupResult(instance, setupResult)
    // currentInstance = null
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

let currentInstance = null

export function getCurrentInstance() {
  return currentInstance
}




