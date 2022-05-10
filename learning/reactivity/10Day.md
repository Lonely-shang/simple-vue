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

      const cUser = computed(() => {
        return user.age;
      });


    });
  });

```

```typescript

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