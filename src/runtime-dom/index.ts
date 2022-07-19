import { createRenderer } from '../runtime-core'

function createElement (type: string) {
  return document.createElement(type)
}

function pathProps (el, key: string, prevVal, nextVal: string) {
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase()
    el.addEventListener(event, nextVal)
  }
  else {
    if (nextVal == undefined || nextVal == null) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextVal)
    }
  }
}

function insert (el, container) {
  container.appendChild(el)
}

const renderer: any = createRenderer({
                        createElement,    // 创建元素
                        pathProps,       // 设置属性
                        insert,          // 插入元素
                      })

export function createApp (...args) {
  return renderer.createApp(...args)
}

export * from '../runtime-core'