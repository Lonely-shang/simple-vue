import { track, trigger } from "./effect"
import { ReactiveFlags } from "./reactive"


const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

// 创建get方法 通过传入isReadonly参数判断是否只读
function createGetter(isReadonly: boolean = false) {
  return function get(target: Iraw, key: string) {
    // 如果传入的的key是`ReactiveFlags.IS_READONLY`则返回传入的isReadonly
    if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    // 如果是readonly则不进行依赖收集
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}
// 创建set函数
function createSetter() {
  return function set(target: Iraw, key: string, value: any) {
    const res = Reflect.set(target, key, value)
    trigger(target, key, value)
    return res
  }
}


export function mutableHandlers () {
  return {
    get,
    set
  }
}
/**
 * 处理readonly包装返回proxy的option
 * @returns {}
 */
export function readonlyHandlers () {
  return {
    get: readonlyGet,
    set(target: Iraw, key: string, value: any) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
      return true
    }
  }
}