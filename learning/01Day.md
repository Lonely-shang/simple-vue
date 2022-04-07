
## 01Day
reactive & effect 的实现

#### reactive
  使用 reactive 会返回对传入的对象用Proxy包装的对象 代理其set get 方法
```javascript
  
  function reactive (raw) {
    return new Proxy(raw, {
      /**
       * 当获取target对象上的属性是会被get方法所捕获
       * get方法执行时会进行依赖收集
       * */
      get(target, key){
        // 这里利用反射通过key获取target对象里的值
        const _val = Reflect.get(target, key);

        // 这里会对依赖target对象上的属性的方法进行收集
        track(target, key);

        return _val;
      },
      /**
       * 当对target对象上的属性重新赋值或修改时会被set方法捕获
       * 当set方法执行是会触发依赖， 执行get方法所收集的方法
       * */
      set (target, key, val) {
        // 这里利用反射对target对象添加属性或修改属性
        const _flag = Reflect.set(target, key, val);
        
        // 这里触发收集的依赖
        trigger(target, key);

        return _flag;
      }

    })
  }
```

### effect


```javascript
  // const user = reactive({ age: 1 })
  // effect(() => {  userEffect = user.age + 1  })
  // effect 内部会将函数执行，函数会被user.age调用时收集起来

  function effect (fun) {
    const _effect = new EffectReactive(fun);

    _effect.runner();
  }
  
  // 用于存放EffectReactive的实例对象
  let effectFun

  // 构造一个EffectReactive类  （为了方便get时的依赖收集）
  // 初始化时会传effect传来的fun
  // 调用runner会执行传过来的fun
  class EffectReactive{
    _fun = null
    
    constructor(fun) {
      this._fun = fun;
    } 

    runner() {
      effectFun = this;
      this._fun();
    }
  }

```

```javascript
  // 依赖收集 & 触发依赖

  // 全局变量存放收集的依赖
  const refectMap = new Map();
  
  /**
   * 依赖收集
   * 
   * */
  function track(target, key){
    // 获取key为target的map
    const depsMap = refectMap.get(target)
    // depsMap不存在 则创建一个map并存放在refectaMap中
    if( !depsMap ){
      depsMap = new Map();
      refectMap.set(target, depsMap)
    }

    // 获取depsMap里key为`${key}`的Set集合
    const deps = depsMap.get(key);
    // 
    if( !deps ) {
      deps = new Set();
      depsMap.set(key, deps);
    }

    // 将依赖target属性的方法添加到deps的Set集合中
    // 这里存放的是fun构造的EffectReactive的实例对象
    deps.add( effectFun )
  }

  /**
   * 触发依赖
   * 通过便利deps的set集合执行EffectReactive的实例对象的runner方法  执行fun函数
   * */
  function trigger(target, key){
    // 获取refectMap中key为target的map
    const depsMap = refectMap.get(target);

    // 获取depsMap中key为`${key}`的Set集合
    const deps = depMap.get(key);

    // 便利deps获取EffectReactive的实例对象 运行runner函数 执行fun
    for(let item of deps){
      item.runner();
    }
  } 

```

