import { refect, trigger } from "./effect";


/**
 * 
 * @param raw 
 * @returns 
 */
export function reactive (raw: Iraw) {

  return new Proxy(raw, {

    get(target: Iraw, key: string){

      const res = Reflect.get(target, key);

      // TODO: 收集依赖
      refect(target, key)

      return res
    },

    set(target: Iraw, key: string, value:any) {

      const res = Reflect.set(target, key, value);

      // TODO: 触发依赖
      trigger(target, key, value)

      return res
    }

  })

}