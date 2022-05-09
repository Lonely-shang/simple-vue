## stop 问题修正

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
    
    // user.age = 2

    /** stop 问题修正!!!
     * 
     * 此时这里相当于调用的get方法 在进行修改 会再次进行依赖收集和触发依赖
     * 造成明明调用stop方法 但是依然会响应式更新effectAge的值
     * */
    user.age++

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
  let shouldTrack: boolean = false // 判断是否收集依赖的全局变量， 默认为false不收集
  class EffectReactive {
    private _fun
    active: boolean = true
    deps: Array<Set<EffectReactive>> = []
    constructor(fun: function, public scheduler?: Function) {
      this._fun = fun;
    }

    run() {
      // 当active为false时表示调用了stop方法
      // 这里直接返回_fun执行返回的内容
      if(!this.active) {
        return this._fun();
      }

      // 当上面active为true时表示没有调用stop方法，需要进行依赖收集

      // 1、将全局变量shouldTrack 置为true
      shouldTrack = true;
      
      // 2、设置全局变量effectFun 和 执行_fun方法
      effectFun = this;
      const res = this._fun();

      // 3、当_fun方法执行完毕 意味着依赖也已经收集完毕， 此时将全局变量shouldTrack重置为false， 方便下次调用判断
      shouldTrack = false;

      // 4、返回_fun方法的返回值
      return res;
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
    
    if(!isTracking()) return;

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
   
    dep.add(effectFun);
    // 反向收集 将dep保存在effectFun中的deps数组中， 在stop时进行清除操作
    // 因为Set是引用类型，所以当清除deps中Set中的值时， refectMap中相应也会清除
    effectFun.deps.push(dep);

  }

  /** 注意！！！
   * 当不使用effect函数，直接使用reactive调用对象的属性时，
   * EffectReactive并未初始化, effectFun是未定义（undefined）的，
   * 此时直接返回跳过下面的收集。
   * */
  // 如果有一个为false都表示 不进行依赖收集
  function isTracking () {
    return shouldTrack && !!effectFun
  }

```
