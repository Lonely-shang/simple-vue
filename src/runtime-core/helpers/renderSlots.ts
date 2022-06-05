import { createVNode } from "../vnode";

export function renderSlots (slots, name, props) {
  let slot = slots[name];
  if (slot) {
    if (typeof slot === 'function') {
      slot = slot(props)
    }
    return createVNode('div', {}, slot)
  }
}