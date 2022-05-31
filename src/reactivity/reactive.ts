import { isObject } from "../shared/index";
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHandlers";

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

/**
 * 将传入的对象包装成响应式的
 * @param raw
 * @returns
 */
export function reactive (raw: Iraw) {
  return createReactiveObject(raw, mutableHandlers())
}

// 将传入的对象包装成只读的对象
export function readonly(raw: Iraw) {
  return createReactiveObject(raw, readonlyHandlers())
}

export function shallowReadonly(raw: Iraw) {
  return createReactiveObject(raw, shallowReadonlyHandlers())
}


export function isReactive(raw: Iraw) {
  return !!raw[ReactiveFlags.IS_REACTIVE]
}


/**
 * 验证传入的raw对象是否是readonly包装的对象
 * @param raw 对象
 * @returns boolean
 */
export function isReadonly(raw: Iraw) {
  // 当不是一个proxy包装的对象会返回undefined
  // 这里对返回值求两次反转换成boolean值
  return !!raw[ReactiveFlags.IS_READONLY]
}

export function isProxy(raw) {
  return isReactive(raw) || isReadonly(raw)
}

function createReactiveObject(raw: Iraw, baseHandler) {
  if (!isObject(raw)) {
    console.warn(`[vue-reactivity] value cannot be made reactive: ${raw}`);
    return raw
  }
  return new Proxy(raw, baseHandler)
}