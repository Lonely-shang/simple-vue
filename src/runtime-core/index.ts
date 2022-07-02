import { h } from "./h"
import { renderSlots } from "./helpers/renderSlots";
import { renderText } from './helpers/renderText'
import { getCurrentInstance } from "./component";
import { provide, inject } from "./apiInject"
import { createRenderer } from './renderer'
export {
  h,
  renderSlots,
  renderText,
  provide,
  inject,
  createRenderer,
  getCurrentInstance
}