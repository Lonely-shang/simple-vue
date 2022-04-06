
let effectFun: EffectReactive
class EffectReactive {
  private _fun: Ifun

  constructor(fun: Ifun){
    this._fun = fun
  }

  runner() {
    effectFun = this
    this._fun()
  }

}


export function effect (fun: Ifun) {

  const _effect: EffectReactive = new EffectReactive(fun)

  _effect.runner()

}

const refectMap: Map<Iraw, Map<string, Set<EffectReactive>>> = new Map()
export function refect (target: Iraw, key: string) {

  let dopsMap = refectMap.get(target)
  if(!dopsMap) {
    dopsMap = new Map()
    refectMap.set(target, dopsMap)
  }

  let dops = dopsMap.get(key)
  if(!dops) {
    dops = new Set()
    dopsMap.set(key, dops)
  }

  dops.add(effectFun)

}

export function trigger (target: Iraw, key: string, value: any) {
  const dopsMap = refectMap?.get(target)
  const dops = dopsMap?.get(key)
  if(dops)
    for (const item of dops) {
      item.runner()
    }
}