import { EffectReactive } from "./effect"


class ComputedRefImpl{
  private _val: any
  private _lock: boolean
  private _effect: EffectReactive

  constructor (fun: Ifun) {
    this._lock = true
    this._effect = new EffectReactive(fun, () => {
      this._lock = true
    })
  }

  get value () {
    if (this._lock) {
      this._lock = false
      this._val = this._effect.run();
    }
    return this._val
  }
}


export function computed(fun: Ifun) {
  return new ComputedRefImpl(fun)
}