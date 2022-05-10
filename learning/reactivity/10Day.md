## Comouted api

```typescript
  // tests/computed.spec.ts

  descript('computed', () => {
    
    it('happy path', () => {
      const user = reactive({
        age: 18
      });

      const cUser = computed(() => {
        return user.age;
      });

      expect(cUser.value).toBe(18);
    });

    it('should compute lazily', () => {
      const user = reactive({
        age: 1
      });

      const getter = jest.fn(() => {
        return user.age;
      });

      const cUser = computed(getter);
      
      expect(getter).not.toHaveBeenCalled();
      
      // 调用`cUser.value` getter方法应执行一次
      expect(cUser.value).toBe(1);
      expect(getter).toHaveBeenCalledTimes(1);

      // 再次调用`cUser.value` getter方法应执行不会执行
      cUser.value;
      expect(getter).toHaveBeenCalledTimes(1);

    });
  });

```

```typescript
  // reactivity/computed.ts

  export function computed(fun: Function) {
    return new ComputedRefImpl(fun);
  }

  class ComputedRefImpl() {
    private _fun: Function

    constructor(fun: Function) {
      this._fun = fun;
    }

    get value() {
      return this._value
    }
  }

```