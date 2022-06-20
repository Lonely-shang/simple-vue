import { renderSlots } from '../../dist/simple-vue.cjs.js';

export const Foo = {
  name: 'Foo',
  setup () {

  },

  render (h) {
    const foo = h('p', {}, 'foo')
    const age = 28
    return h('div', {}, [renderSlots(this.$slots, 'header', { age }), foo, renderSlots(this.$slots, 'footer')])
  }
}