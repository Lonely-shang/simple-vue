## reactive 和 readonly 嵌套

```typescript
 
  it('reactive', () => {

    const user = reactive({
      age: 18,
      interest: {
        one: 'music',
        two: ''
      }
    })
    
    expect(isReactive(user.interest).toBe(true))

  })

  it('readonly', () => {
     const user = readonly({
      age: 18,
      interest: {
        one: 'music',
        two: ''
      }
    })

    expect(isReadonly(user.interest).toBe(true))
  })
 
```

```typescript
  // shared/index.ts

  export function isObject(obj: object) {
    return typeof obj === 'object' && obj !== null;
  }
```


```typescript
  // baseHandlers.ts

  function createGetter(isReadonly: boolean = false) {
    return function get(target: object, key: string) {
      
      const res = Reflect.get(target, key);

      // 判断res返回值是否为对象
      if(isObject(res)) {
        // 通过判断isReadonly参数来调用方法
        return isReadonly ? readonly(res) : reactive(res);
      }

      if(!isReadonly) {
        track(target, key);
      }

      return res;      
    }
  }  

```


