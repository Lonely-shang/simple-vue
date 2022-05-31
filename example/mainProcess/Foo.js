
export const Foo = {
  name: 'Foo',
  setup (props) {
    console.log(props);
    props.count ++
  },

  render (h) {
    return h('div', {}, 'Hello ' + this.count)
  }
}