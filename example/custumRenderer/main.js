import { createRenderer } from '../../dist/simple-vue.cjs.js';
// import { App } from './App.js';

const game = new PIXI.Application({
  height: 800,
  width: 800,
});

document.body.appendChild(game.view);

const renderer = createRenderer({
  createElement() {},
  patchProps() {},
  insert() {}
});

console.log(game.stage);

// createApp(App).mount(game.stage);
