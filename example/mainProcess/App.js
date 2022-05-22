

export const  App = {

  render(h) {
    return h('div', 'hello '+ this.msg)
  },

  setup() {
    return {
      msg: 'world'
    }
  }
}