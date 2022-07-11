import { ref } from '../../dist/simple-vue.cjs.js';

export const App = {
  setup () {

    const count = ref(0)

    const onClick = () => {
      count.value ++
    }

    return {
      count,
      onClick
    }
  },

  render (h) {
    return h(
      'div',
      {
        id: 'root'
      },
      [
        h('div', {}, 'count' + this.count),
        h('button', { onClick: this.onClick }, 'click'),
      ]
    )
  }
}