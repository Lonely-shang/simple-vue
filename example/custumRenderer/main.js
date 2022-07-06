import { createRenderer } from '../../dist/simple-vue.cjs.js';
import { App } from './App.js';

const game = new PIXI.Application({
  height: 800,
  width: 800,
});

document.body.appendChild(game.view);

const renderer = createRenderer({
  createElement(type) {
    if (type === 'rect') {
      const rect = new PIXI.Graphics()
      rect.beginFill(0xff0000)
      rect.drawRect(0, 0, 100, 100)
      rect.endFill()

      return rect
    }
  },
  pathProps(el, key, value) {
    el[key] = value
  },
  insert(el, parent) {
    console.log(parent);
    parent.addChild(el)
  }
});

console.log(game.stage);

renderer.createApp(App).mount(game.stage);
