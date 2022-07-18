import { ref } from '../../dist/simple-vue.cjs.js';

export const App = {
  setup () {

    const count = ref(0)

    const onClick = () => {
      count.value ++
    };

    const props = ref({
      foo: 'foo',
      bar: 'bar'
    })

    const onChangePropsDemo1 = () => {
      props.value.foo = 'newFoo'
    }

    const onChangePropsDemo2 = () => {
      props.value.foo = undefined
    }

    const onChangePropsDemo3 = () => {
      props.value = {
        foo: 'foo'
      }
    }

    return {
      count,
      props,
      onClick,
      onChangePropsDemo1,
      onChangePropsDemo2,
      onChangePropsDemo3
    }
  },

  render (h) {
    return h(
      'div',
      {
        id: 'root',
        ...this.props
      },
      [
        h('div', {}, 'count' + this.count),
        h('button', { onClick: this.onClick }, 'click'),
        h('button', { onClick: this.onChangePropsDemo1 }, 'onChangePropsDemo1'),
        h('button', { onClick: this.onChangePropsDemo2 }, 'onChangePropsDemo2'),
        h('button', { onClick: this.onChangePropsDemo3 }, 'onChangePropsDemo3'),
      ]
    )
  }
}