
import ArrayToText from './ArrayToText.js'

export const App = {
  setup () {
    return {
    }
  },

  render (h) {
    return h(
      'div',
      { tid: 1},
      [
        h('p', {}, '主页'),
        h(ArrayToText)
      ]
    )
  }
}