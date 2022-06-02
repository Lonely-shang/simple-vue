
export const Foo = {
  name: 'Foo',
  setup (props, { emit }) {

    const emitClick = () => {
      emit('add', 1, 2)
      emit('add-foo')
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