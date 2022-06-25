import { getCurrentInstance } from "./component"

export function provide (key: string, value: any) {
  //
  const instance: any = getCurrentInstance()

  if (instance) {
    instance.provides[key] = value;
  }
}

export function inject (key: string) {

  const instance: any = getCurrentInstance()

  if (instance) {
    return instance.parent.provides[key]
  }

}