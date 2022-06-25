import { provide, inject } from  '../../dist/simple-vue.cjs.js';

export const  App = {
  name: 'App',
  setup() {
    provide('foo', 'fooVal');
    provide('bar', 'barVal');
  },
  render(h) {
    return h(
      'div',
      {},

      [
        h('div', {}, 'Provide'),
        h(Cusumer)
      ]
    )
  }
}

const Cusumer = {
  name: 'Inject',
  setup() {
    const foo = inject('foo');
    const bar = inject('bar');
    return {
      foo,
      bar
    }
  },
  render(h) {
    return h('div', {}, `Cusumer - ${this.foo} - ${this.bar}`)
  }
}