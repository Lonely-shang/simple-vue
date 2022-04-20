import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffect, triggerEffect } from "./effect"
import { reactive } from "./reactive"

class RefImpl {
  private _value: any
  private dep
  private _rawValue
  constructor(val){
    this._rawValue = val
    this._value = isObject(val) ? reactive(val) : val
  }

  get value () {

    this.dep = new Set()
    // 收集依赖
    if (isTracking()) {
      trackEffect(this.dep)
    }

    return this._value
  }

  set value (value: any) {
    if(hasChanged(this._rawValue, value)){
      this._rawValue = value
      this._value = value
      triggerEffect(this.dep)
    }
  }
}

export function ref(val) {
  return new RefImpl(val)
}