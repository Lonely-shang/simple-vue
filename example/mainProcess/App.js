

export const  App = {

  render(h) {
    window.proxy = this;
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