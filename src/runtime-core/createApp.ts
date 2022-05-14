

export function createApp(component, domId: string) {

  return {
    mount,
  }
}

function mount(domId: string) {
  const el = document.getElementById(domId)
  if (!el) {
    throw new Error(`找不到指定的dom元素: ${domId}`)
  }
}