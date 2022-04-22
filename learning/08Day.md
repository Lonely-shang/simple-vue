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

  })

```

```typescript
  // ref.ts

  class RefImpl{
    private _val
    dep
    constructor(value){
      this._val = value;
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

      
      this._val = newVal
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

  export function trackEffect(dep) {
    dep.add(effectActive);
    effectActive.deps.push(dep);
  }

```