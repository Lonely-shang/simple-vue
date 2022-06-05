import { ShapeFlags } from "../shared/ShapeFlags";

export function initSlots (instance, children) {

  if (instance.vnode.shapeFlag & ShapeFlags.SLOTS_CHILDREN) {
    normalizeObjectSlots(children, instance.slots)
  }

}

function normalizeObjectSlots (children, slots) {

  for (const key in children) {
    console.log(key);
    const value = children[key]
    slots[key] = (props) => normalizeSlotsValue(value(props))
  }
}

function normalizeSlotsValue (value) {
  return Array.isArray(value) ? value : [value]
}
