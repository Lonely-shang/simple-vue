import { Foo } from './Foo.js'

export const  App = {
  name: 'App',
  render(h) {
    return h(
      'div',
      {
        id: 'el',
        onClick: () => {
          alert('hello', 'world');
        },
        onMousedown: () => {
          console.log('mouse down');
        }
      },
      [
        h('div', {}, 'Hello' + this.msg),
        h(Foo, {
          count: 1
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