import { h, ref } from '../../dist/simple-vue.cjs.js';

const nextChildren = "newChildren";
const prevChildren = [h('div', {}, 'A'), h('div', {}, 'B')]
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
      : h('div', {}, prevChildren)
  }
}