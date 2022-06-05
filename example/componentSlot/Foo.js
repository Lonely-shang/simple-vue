import { renderSlots } from '../../dist/simple-vue.cjs.js';

export const Foo = {
  name: 'Foo',
  setup () {

  },

  render (h) {
    const foo = h('p', {}, 'foo')
    console.log(this.$slots);
    return h('div', {}, [foo, renderSlots(this.$slots)])
  }
}