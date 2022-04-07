
## 01Day
reactive & effect 的实现

#### reactive
```javascript
  // 使用 reactive 会返回对传入的对象用Proxy包装的对象 代理其set get 方法
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
        refect();

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
        trigger();

        return _flag;
      }

    })
  }
```

### effect


