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
        h(provideTwo)
      ]
    )
  }
}

const provideTwo = {
  name: 'provideTwo',
  setup() {
    provide('foo', 'provideTwo')
    const foo = inject('foo')
    return {
      foo
    }
  },
  render(h) {
    return h(
      'div',
      {},

      [
        h('div', {}, 'provideTwo - ' + this.foo),
        h(Cusumer)
      ]
    )
  }
}

const Cusumer = {
  name: 'Inject',
  setup() {
    const foo = inject('foo');
    // const bar = inject('bar');
    const no = inject('no', 'defaultValue');
    return {
      foo,
      // bar,
      no
    }
  },
  render(h) {
    return h('div', {}, `Cusumer - ${this.foo} - ${this.no}`)
  }
}