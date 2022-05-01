## isRef & unRef

```typescript
  // tests/ref.spec.ts

  descript('ref', () => {

    it('isRef', () => {
      const num = 1;
      const a = ref(num);

      expect(isRef(num)).toBeFalsy();
      expect(isRef(a)).toBeTruthy();
    })

    it('unRef', () => {
      const num = 1;
      const a = ref(num);

      expect(num).toBeFalsy();
      expect(unRef(a)).toBe(1);
    })

  })

```

```typescript
  // reactivity/ref.ts

  /**
   * 将ref设计成.value形式 方便进行通过触发value方法进行
   * 依赖收集和触发依赖
   */
  class RefImpl{
    private _value: any
    private dep  // 存放收集的依赖
    private _rawValue // 存放原始值，方便后期比较是否相同
    public isRef = true
    constructor(val){
      this.dep = new Set()
      this._rawValue = val
      // 通过判断传入的是否是对象，相应的时候进行reactive进行包装
      this._value = isObject(val) ? reactive(val) : val
    }

    get value () {

      // 收集依赖
      if (isTracking()) {
        trackEffect(this.dep)
      }

      return this._value
    }

    set value (value: any) {
      if(hasChanged(this._rawValue, value)){
        this._rawValue = value
        this._value = value
        triggerEffect(this.dep)
      }
    }
  }

  export function isRef(val: any) {
    return !!val.isRef;
  }

  export function unRef(val: any) {
    return !!val.isRef && val.value;
  }

```
