

class ComputedRefImpl{
  private _fun: Function

  constructor (fun: Function) {
    this._fun = fun
  }

  get value () {
    return this._fun()
  }
}


export function computed(fun: Function) {
  return new ComputedRefImpl(fun)
}