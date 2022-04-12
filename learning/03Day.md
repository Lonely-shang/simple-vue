## stop & onStop 学习
下面标注的类型都是大概的类型，主要是逻辑（以后均是如此）

#### stop

```typescript
  /**
   * 当使用stop方法，传入一个effect的返回函数，
   * 当数据修改时，停止effect更新
   * */
  it('stop', () => {
    let effectAge;

    const user = reactive({ age: 1 });

    const runner = effect(
      () => {
        effectAge = user.age;
      }
    );

    expect(effectAge).toBe(1);

    stop(runner)

    user.age = 2

    expect(effectAge).toBe(1)

    runner()

    expect(effectAge).toBe(2)
  })

``` 

```typescript
  // effect.ts
  
  // stop方法 接收一个effect返回的函数
  // 调用stop方法
  function stop(runner: Function) {
    // 问： 怎么通过runner函数调用到EffectReactive实例上的方法？？？
    runner.effect.stop();
  }

  function effect(fun: Function, options: Object) {
    const _effect = new EffectReactive(fun, options?.scheduler);

    _effect.run();
    
    const runner = _effect.run.bind(_effect);
    // 将实例_effect挂在在runner上，方便stop函数调用_effect上的stop方法
    runner.effect = _effect;

    return runner; 

  }
  
  // 给EffectReactive类添加stop方法
  let effectFun
  class EffectReactive {
    private _fun
    active: boolean = true
    deps: Array<Set<EffectReactive>> = []
    constructor(fun: function, public scheduler?: Function) {
      this._fun = fun;
    }

    run() {
      effectFun = this;
      this._fun();
    }

    stop() {
      // 调用stop方法 将track收集的EffectReactive实例从Set中删除
      // 问： 怎样获取到track收集的Set
      if(this.active) {  // 防止重复调用stop执行同一个runner
        this.active = false;
        if(this.deps.length){
          deleteupEffect(this);
        }      
      }
    }
  }
  // 循环遍历删除Set中的effect
  function deleteupEffect(effect: EffectReactive) {
    effect.deps.foreach(item => {
      item.delete(effect);
    })
  }

  const refectMap = new Map();
  function track(target, key) {
    let depsMap = refectMap.get(target);
    if(!depsMap) {
      depsMap = new Map();
      refect.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if(!dep) {
      dep = new Set();
      depsMap.set(key, dep);
    }
   
    /** 注意！！！
     * 当不使用effect函数，直接使用reactive调用对象的属性时，
     * EffectReactive并未初始化, effectFun是未定义（undefined）的，
     * 此时直接返回跳过下面的收集。
     * */
    if(!effectFun) return;

    dep.add(effectFun);
    // 反向收集 将dep保存在effectFun中的deps数组中， 在stop时进行清除操作
    // 因为Set是引用类型，所以当清除deps中Set中的值时， refectMap中相应也会清除
    effectFun.deps.push(dep);

  }

```


#### onStop

```typescript
  // 当调用stop方法时，会触发effect->options中的onStop方法执行

  let effectAge
  const user = reactive({ age: 1 });

  const onStop = jest.fn();

  const runner = effect(
    () => {
      effectAge = user.age;
    },
    {
      onStop
    }
  );

  stop(runner);

  expect(onStop).toHaveBeenCalledTimes(1);

```

```typescript
  // effect.ts
  
  
  function stop(runner: Function) {
    
    runner.effect.stop();
  }

  function effect(fun: Function, options: Object) {
    const _effect = new EffectReactive(fun, options?.scheduler);

    // 把options中的onStop传到_effect中， 使用Object.assign
    Object.assign(_effect, options);

    _effect.run();
    
    const runner = _effect.run.bind(_effect);

    runner.effect = _effect;

    return runner; 

  }
  
  let effectFun
  class EffectReactive {
    private _fun
    active: boolean = true
    onStop?: () => void     // 这里接收传进来的onStop函数
    deps: Array<Set<EffectReactive>> = []
    constructor(fun: function, public scheduler?: Function) {
      this._fun = fun;
    }

    run() {
      effectFun = this;
      this._fun();
    }

    stop() {
      if(this.active) { 
        this.active = false;
        if(this.deps.length){
          deleteupEffect(this);
          if(this.onStop) {  // 这里判断onStop是否存在
            this.onStop();
          }
        }      
      }
    }
  }

  function deleteupEffect(effect: EffectReactive) {
    effect.deps.foreach(item => {
      item.delete(effect);
    })
  }

  const refectMap = new Map();
  function track(target, key) {
    let depsMap = refectMap.get(target);
    if(!depsMap) {
      depsMap = new Map();
      refect.set(target, depsMap);
    }

    let dep = depsMap.get(key);
    if(!dep) {
      dep = new Set();
      depsMap.set(key, dep);
    }
   

    if(!effectFun) return;

    dep.add(effectFun);

    effectFun.deps.push(dep);

  }

```