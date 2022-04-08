## effect expand (scheduler)

扩展effect函数添加可配置选项

```javascript
// 根据测试来实现相应的功能
describe('effect', () => {

  it('scheduler', () => {

    let run, effectAge;

    const user = reactive({ age: 1 });

    // 当scheduler被触发时run会被赋值
    const scheduler = jest.fn(() => {
      run = runner;
    })
    // 在effect调用后会返回一个runner函数可以手动触发effect函数的执行
    const runner = effect(
      () => {
        effectAge = user.age;
      },
      { scheduler }
    );
    // 验证scheduler函数没有被执行
    expect(scheduler).not.toHaveBeenCalled();
    // 验证effectAge是否等于1（effectAge = 1， 则验证effect首次执行会执行里面的函数）
    expect(effectAge).toBe(1);
    // 触发user的get方法，触发收集的依赖
    user.age++;
    // 当触发依赖时 会触发scheduler函数
    expect(scheduler).toHaveBeenCalledTimes(1);
    // 验证当执行scheduler函数时并不会执行effect第一个参数的函数
    expect(effectAge).toBe(1);
    // 执行effect返回的函数
    run();
    // 验证run函数执行是是否执行effect的内部函数
    expect(effectAge).toBe(2);
  })
})

```
根据测试修改相应的 effect trigger EffectReactive 方法

##### before update
```typescript
  let trackMap = new Map(), // 收集所有的依赖
      effectReactive;       // 存放依赖的实例化的类


  class EffectReactive {
    private _fun;

    constructor(fun){
      this._fun = fun;
    }

    run () {      
      this.run();
    }
  }
  // effect函数
  function effect ( fun: Function ) {
    const _effect = new EffectReactive(fun);
    _effect.run();
  }

  // 触发依赖
  function tirgger (target: Object, key: string) {
    const depsMap: Map = trackMap.get(target);
    const deps: Set = depsMap.get(key);
    for(let item of deps) {
      item.run();   
    }
  
```
###### after update

```typescript

  let trackMap = new Map(), // 收集所有的依赖
      effectReactive;       // 存放依赖的实例化的类

  class EffectReactive {
    private _fun;
    // 3、将scheduler作为可选参数向外暴露出去
    constructor(fun, public scheduler?){
      this._fun = fun;
    }

    run () {
      effectReactive = this;
      // 如果effect中传入的函数有返回值那么直接执行后返回     
      return this.run();
    }
  }
  // effect函数
  // 1、为effect添加第二参数 为一个对象
  function effect ( fun: Function, options?: Object ) {
    // 2、将options里的scheduler传入EffectReactive
    const _effect = new EffectReactive(fun, options.scheduler);
    _effect.run();

    // TODO: 此处对外返回一个run函数
    // 6、返回一个EffectReactive实例对象的run函数
    // 注意修改run函数中的this指向问题
    return _effect.run.bind(_effect);
  }

  // 触发依赖
  // 5、修改trigger函数 当effectReactive对象中有scheduler函数时执行scheduler函数否则执行run函数
  function tirgger (target: Object, key: string) {
    const depsMap: Map = trackMap.get(target);
    const deps: Set = depsMap.get(key);
    for(let item of deps) {
      // 验证是否有scheduler函数
      if( item.scheduler ) {
        item.scheduler();
      } else {
        item.run();
      }
    }
  }
```
