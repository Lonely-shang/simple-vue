import { createApp } from "./createApp";
import { h } from "./h"
import { renderSlots } from "./helpers/renderSlots";
import { renderText } from './helpers/renderText'
import { getCurrentInstance } from "./component";
import { provide, inject } from "./apiInject"
export {
  createApp,
  h,
  renderSlots,
  renderText,
  provide,
  inject,
  getCurrentInstance
}