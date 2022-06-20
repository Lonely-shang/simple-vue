import { Foo } from './Foo.js'
import { renderText } from '../../dist/simple-vue.cjs.js';

export const  App = {
  name: 'App',
  render(h) {

    const foo = h(
      Foo,
      {},
      {
        header: (slot) =>  h('div', {}, [h('p', {}, 'Header' + slot.age), renderText('11111')]),
        footer: () =>  h('div', {}, 'Footer'),
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