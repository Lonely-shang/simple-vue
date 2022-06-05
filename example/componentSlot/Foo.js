
export const Foo = {
  name: 'Foo',
  setup () {

  },

  render (h) {
    const foo = h('p', {}, 'foo')
    console.log(this.$slots);
    return h('div', {}, [foo, this.$slots])
  }
}