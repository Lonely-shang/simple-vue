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

export function inject (key: string) {

  const instance: any = getCurrentInstance()

  if (instance) {
    return instance.parent.provides[key]
  }

}