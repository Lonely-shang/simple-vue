export const App = {
  setup () {
    return {
      x: 100,
      y: 100
    }
  },

  render (h) {
    return h('rect', {x: this.x, y: this.y})
  }
}