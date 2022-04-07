
let effectFun: EffectReactive
class EffectReactive {
  private _fun: Ifun

  constructor(fun: Ifun, public scheduler?){
    this._fun = fun
  }

  run() {
    effectFun = this
    return this._fun()
  }

}


export function effect (fun: Ifun, options: IeffectOptions = {}) {

  const _effect: EffectReactive = new EffectReactive(fun, options?.scheduler)

  _effect.run()

  return _effect.run.bind(_effect)

}

const refectMap: Map<Iraw, Map<string, Set<EffectReactive>>> = new Map()
// 收集依赖
export function track (target: Iraw, key: string) {

  let depsMap = refectMap.get(target)
  if(!depsMap) {
    depsMap = new Map()
    refectMap.set(target, depsMap)
  }

  let deps = depsMap.get(key)
  if(!deps) {
    deps = new Set()
    depsMap.set(key, deps)
  }

  deps.add(effectFun)

}

// 触发依赖
export function trigger (target: Iraw, key: string, value: any) {
  const depsMap = refectMap?.get(target)
  const deps = depsMap?.get(key)
  if(deps)
    for (const item of deps) {
      if(item.scheduler){
        item.scheduler()
      } else {
        item.run()
      }
    }
}