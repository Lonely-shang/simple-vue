## isProxy & shallowReadonly

#### isProxy
```typescript

  it('reactive', () => {
    const user = { name: 'Miliky', class: { english: 1} };
    const reactiveUser = reactive(user);

    expect(isProxy(reactiveUser)).toBe(true);
  })

  it('readonly', () => {
    const user = { name: 'Miliky', class: { english: 1} };
    const readonlyUser = reactive(user);

    expect(isProxy(readonlyUser)).toBe(true);
  })

```
```typescript
  // reactive.ts

  const enum reactiveFlag {
    IS_REACTIVE: '__v_isReactive',
    IS_READONLY: '__v_isReadonly'
  }

  function isReactive(raw: object) {
    return !!raw[reactiveFlag.IS_REACTIVE];
  }

  function isReadonly(raw: object) {
    return !!raw[reactiveFlag.IS_READONLY]
  }


  function isProxy(raw: object) {
    return isReactive(raw) || isReadonly(raw);
  }

```

#### shallowReadonly

```typescript
  
  it('shallowReadonly', () => {
    const user = { name: 'Miliky', class: { english: 1 }} 
    const wrapped = shallowReadonly(user)
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(wrapped.class)).toBe(false);
  })

```

```typescript
  // reactive.ts 
  
  export function shallowReadonly(raw: object) {
    return createReactiveObject(raw, shallowReadonlrHandlers());
  }


  function createReactiveObject(raw: object, baseHandlers: object) {
    return new Proxy(raw, baseHandlers);
  }
```
```typescript
  // baseHanders.ts
  
  const shallowReadonlyGet = createGetter(true, true);

  function createGetter(isReadonly: boolean = false, shallow: boolean = false) {
    return function get (target: object, key: string) {
      if(key === reactiveFlag.IS_REACTIVE) {
        return !isReadonly;
      } else if(key === reactiveFlag.IS_READONLY){
        return isReadonly;
      }


      const res = Reflect.get(target, key);

      if(shallow){
        return res;
      }      

      if(isObject(res)) {
        return isReadonly ? readonly(res) : reactive(res);
      }

      if(!isReadonly) {
        track(target, key);
      }

      return res
    }
  }

  export shallowReadonlyHandler() {
    return {
      get: shallowReadonlyGet,
      set(target: Iraw, key: string, value: any) {
        console.warn(
          `Set operation on key "${String(key)}" failed: target is readonly.`,
          target
        )
        return true
      }
    }
  }  

```
```typescript
  // shared/index.ts
  export function isObject(raw: any) {
    return typeof raw === 'object' && raw !== null;
  }

```