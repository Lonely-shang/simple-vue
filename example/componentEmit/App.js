import { Foo } from './Foo.js'

export const  App = {
  name: 'App',
  render(h) {
    return h(
      'div',
      {
        id: 'el',
      },
      [
        h('div', {}, 'Hello' + this.msg),
        h(Foo, {
          onAdd(a, b) {
            console.log('emit add', a, b)
          }
        })
      ]
    )
  },

  setup() {
    return {
      msg: 'world!'
    }
  }
}