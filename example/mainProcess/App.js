

export const  App = {

  render(h) {
    window.proxy = this;
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
      'Hello ' + this.msg
    )
  },

  setup() {
    return {
      msg: 'world!'
    }
  }
}