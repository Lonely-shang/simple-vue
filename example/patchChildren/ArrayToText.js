import { ref } from '../../dist/simple-vue.cjs.js';

const nextChildren = "newChildren";

export default {
  name: 'ArrayToText',
  setup () {
    const isChange = ref(false);
    window.isChange = isChange;
    return {
      isChange
    }
  },

  render (h) {
    const that = this;

    return that.isChange === true
      ? h('div', {}, nextChildren)
      : h('div', {}, [
        h('div', {}, 'A'),
        h('div', {}, 'B')
      ])
  }
}