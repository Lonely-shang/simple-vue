import { h } from '../../dist/simple-vue.cjs.js'

export const  App = {

  render() {
    return h(
      'div',
      {
        id: 'el',
      },
      [
        h('p', {style: 'color: red;'}, '1'),
        h('p', {style: 'color: green;'}, '2')
      ]
    )
  },

  setup() {
    return {
      msg: 'world'
    }
  }
}