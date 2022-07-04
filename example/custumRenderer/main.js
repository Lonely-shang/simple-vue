import { createRenderer } from '../../dist/simple-vue.cjs.js';
// import { App } from './App.js';

const game = new PIXI.Application({
  height: 800,
  width: 800,
});

const renderer = createRenderer({
  createElement() {},
  patchProps() {},
  insert() {}
});

// createApp(App).mount(game.view);
