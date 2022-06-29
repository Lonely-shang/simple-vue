import { getCurrentInstance } from "./component"

export function provide (key: string, value: any) {
  //
  const instance: any = getCurrentInstance()

  if (instance) {
    let { provides }  = instance
    const parentProvides = instance.parent.provides

    if (provides == parentProvides) {
      provides = instance.provides = Object.create(parentProvides || {})
    }

    provides[key] = value;
  }
}

export function inject (key: string, defaultValue: any) {

  const instance: any = getCurrentInstance()

  if (instance) {
    const parentProvides = instance.parent.provides

    if (key in parentProvides) {
      return parentProvides[key]
    }else if (defaultValue) {
      return defaultValue
    }
  }

}