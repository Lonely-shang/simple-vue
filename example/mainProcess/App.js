

export const  App = {

  render(h) {
    window.proxy = this;
    return h(
      'div',
      {
        id: 'el',
        onClick: () => {
          alert('hello', 'world');
        }
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