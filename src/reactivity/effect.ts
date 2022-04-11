import { extend } from "../shared"

let effectFun: EffectReactive
class EffectReactive {
  private _fun: Ifun
  active: boolean = true
  onStop?: () => void
  deps: Array<Set<EffectReactive>> = []
  constructor(fun: Ifun, public scheduler?){
    this._fun = fun
  }

  run() {
    effectFun = this
    return this._fun()
  }

  stop(){
    // 移除对应收集的依赖方法
    if(this.deps.length){
      if(this.active){
        this.active = false
        deleteupEffect(this)
        if (this.onStop) {
          this.onStop()
        }
      }
    }
  }
}

function deleteupEffect(effect: EffectReactive) {
  effect.deps.forEach(item => {
    item.delete(effect)
  })
}


export function effect (fun: Ifun, options: IeffectOptions = {}) {

  const _effect: EffectReactive = new EffectReactive(fun, options?.scheduler)

  // 将options中的onStop方法赋值给EffectReactive
  // _effect.onStop = options?.onStop
  extend(_effect, options)

  _effect.run()

  const runner = _effect.run.bind(_effect) as IeffectReactiveRunner
  // 将EffectReactive实例绑定到runner函数上，方便调用stop函数
  runner.effect = _effect

  return runner

}

export function stop (runner: IeffectReactiveRunner) {
  runner.effect.stop() // 调用stop方法
}

const refectMap: Map<Iraw, Map<string, Set<EffectReactive>>> = new Map()
// 收集依赖
export function track (target: Iraw, key: string) {

  let depsMap = refectMap.get(target)
  if(!depsMap) {
    depsMap = new Map()
    refectMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if(!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

  // 当只触发get方法时，不调用effect函数时，未实例化EffectReactive，effectFun is undefined
  // 当为undefined时直接返回
  if (!effectFun) return

  dep.add(effectFun)
  // 反向收集保存一下dep
  effectFun.deps.push(dep)
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