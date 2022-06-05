import { isObject } from "../shared/index";

export function initSlots (instance, children) {

  normalizeObjectSlots(children, instance.slots);
}

function normalizeObjectSlots (children, slots) {

  for (const key in children) {
    console.log(key);
    const value = children[key]
    slots[key] = normalizeSlotsValue(value)
  }
}

function normalizeSlotsValue (value) {
  return Array.isArray(value) ? value : [value]
}
