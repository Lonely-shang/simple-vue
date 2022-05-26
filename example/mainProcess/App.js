

export const  App = {

  render(h) {
    return h(
      'div',
      {
        id: 'el',
      },
      'Hello ' + this.msg
    )
  },

  setup() {
    return {
      msg: 'world!'
    }
  }
}