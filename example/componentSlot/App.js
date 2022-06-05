import { Foo } from './Foo.js'

export const  App = {
  name: 'App',
  render(h) {

    const foo = h(
      Foo,
      {},
      {
        header: h('div', {}, 'Header'),
        footer: h('div', {}, 'Footer'),
      }
    )
    return h(
      'div',
      {
        id: 'el',
      },
      [
        h('div', {}, 'Hello' + this.msg),
        foo
      ]
    )
  },

  setup() {
    return {
      msg: 'world!'
    }
  }
}