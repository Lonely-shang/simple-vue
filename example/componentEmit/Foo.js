
export const Foo = {
  name: 'Foo',
  setup (props) {

    const emitClick = () => {
      console.log('click');
    }

    return {
      emitClick
    }

  },

  render (h) {
    const Btn = h('button', {
      onClick: this.emitClick
    }, 'emit click')
    return h('div', {}, [Btn])
  }
}