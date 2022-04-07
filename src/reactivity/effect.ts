
let effectFun: EffectReactive
class EffectReactive {
  private _fun: Ifun

  constructor(fun: Ifun){
    this._fun = fun
  }

  run() {
    effectFun = this
    this._fun()
  }

}


export function effect (fun: Ifun) {

  const _effect: EffectReactive = new EffectReactive(fun)

  _effect.run()

}

const refectMap: Map<Iraw, Map<string, Set<EffectReactive>>> = new Map()
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

export function trigger (target: Iraw, key: string, value: any) {
  const dopsMap = refectMap?.get(target)
  const dops = dopsMap?.get(key)
  if(dops)
    for (const item of dops) {
      item.run()
    }
}