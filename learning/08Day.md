## ref

```typescript
  // ref.spec.ts

  describe('ref', () => {

    it('happy path', () => {
      const wrapped = ref(1)

      expect(wrapped.value).toBe(1)
    })

    it('', () => {
      const a = ref(1)
      let dummy;
      let calls = 0
      effect(() => {
        calls++
        dummy = a.value
      })

      expect(calls).toBe(1)
      expect(dummy).toBe(1)
      a.value = 2
      expect(calls).toBe(2)
      expect(dummy).toBe(2)

      // same value should not trigger
      a.value = 2
      expect(calls).toBe(2)
      expect(dummy).toBe(2) 
    })

    it('should make nested properties reactive', () => {
      const a = ref({
        count: 1
      })
      let dummy
      let calls = 0
      effect(() => {
        calls++
        dummy = a.value.count
      })

      expect(dummy).toBe(1)
      a.value.count = 2
      expect(dummy).toBe(2)
    })

  })

```

```typescript
  // ref.ts

  class RefImpl{
    private _val
    private dep
    constructor(value){
      this._rawVal = value;
      this._val = isObject(value) ? reactive(value) : value;
      this.dep = new Set();
    }

    // 通过.value触发依赖收集
    get value() {

      // 进行依赖收集，直接收集到自身的dep的set对象中
      if(isTracking()) {
        trackEffect(dep)
      }

      return this._val;
    }

    // 通过触发value来触发依赖
    set value(newVal){
      if(hasChange(this._rawVal, newVal)){
        // 进行触发依赖
        this._rawVal = newVal
        triggerEffect(dep)
        this._val = newVal
      } 
    }
  }

  export function ref(val) {
    // 构造一个Ref的对象返回
    return new RefImpl(val);
  } 
```

```typescript
  const effectActive = null;

  const depsMap = new Map()
  export function track(target, key) {
    if(isTracking()) return;
    let deps = depsMap.get(target);
    if(!deps) {
      deps = new Map();
      depsMap.set(target, deps);
    }
    let dep = deps.get(key);
    if(!dep) {
      dep = new Set();
      deps.set(key, dep);
    }
  }

  // 将添加的方法抽离 方便`ref`api 调用
  export function trackEffect(dep) {
    dep.add(effectActive);
    effectActive.deps.push(dep);
  }

  export function trigger (target, key){
    const deps = depsMap.get(target);

    const dep = deps.get(key);

    triggerEffect(dep);
  }
  
  export function triggerEffect(dep){
    for(let item in dep){
      if(item.scheduler){
        item.scheduler();
      }else {
        item.run();
      }
    }
  }

```
```typescript
  // shared/index.ts

  export function hasChanged(value, oldValue) {
    return !Object.is(value, oldValue);
  }

```