## readonly & isReadonly

#### readonly

```typescript
  // readonly.spec.ts

  descript('readonly', () => {
    it('happy path', () => {
      
      console.warn = jest.fn();

      const user = { age: 1 };

      const readonlyUser = readonly(user);
      
      expect(user).not.toBe(readonlyUser);

      readonlyUser.age = 2

      expect(console.warn).toBeCalled();

      expect(readonlyUser.age).toBe(1);
    })
  })

```

```typescript
  // reactive.ts

  function readonly(raw: Object) {
    return new Proxy(raw, {
      get(targrt: Object, key: string){
        const res = Reflect.get(target, key);
        // 这里不进行依赖收集，readonly不能进行修改 不能触发依赖，故这里不进行依赖收集
        return res;
      },
      set(target: Object, key: string, value: any){
        return true;
      }
    })
  }

```

#### isReadonly

```typescript
  // readonly.spec.ts

  it('isReadonly', () => {
    const user = { age: 1 };

    const readonlyUser = readonly(user);

    expect(isReadonly(readonlyUser)).toBe(true)

    expect(isReadonly(user)).toBe(false)

  })

```

```typescript
  // 这里会对相关代码进行重构

  // reactive.ts

  export const enum ReactiveFlags {

    IS_READONLY = '__v_isreadonly'

  }

  export function readonly(raw: Object) {

    return createreactiveObject(raw, readonlyHandlers());

  }

  export function isReadonly(raw) {
    // 判断是否是readonly，通过触发raw的get方法来获取传入的是否是readonly
    // 注意！！！ 当isReadonly验证一个普通对象，并不能触发get 下面返回的是一个undefined 故对返回值求两次反 将其转化成boolean值返回
    // return raw['readonly'];
    return !!raw[ReactiveFlags.IS_READONLY];
  }

  // 抽离Proxy构建一个创造返回Proxy的函数
  function createReactiveObject(raw: Object, baseHandlers: Object) {
    return Proxy(raw, baseHandlers);
  }

```
```typescript

  // baseHandlers.ts
  const get = createGetter();
  const set = createSetter();
  const readonlyGet = createGetter(true);

  export function multableHandlers() {
    return {
      get,
      set
    }
  }

  export function readonlyHandlers() {
    return {
      get: readonlyGet,
      // readonly 修饰的对象只读不能进行修改，这里抛出警告直接返回true
      set(target: Object, key: string, value: any) {
        console.warn(
          `Set operation on key "${String(key)}" failed: target is readonly.`,
          target
        )
        return true;
      }
    }
  }
  
  // 封装get函数 通过传入的isReadonly参数判断时候是readonly修饰的对象 从而判断是否进行依赖收集
  function createGetter(isReadonly: boolean = false) {
    return function get(target: Object, key: string) {
      // 通过key判断是否是在调用isReadonly方法 从而返回传入isReadonly参数
      
      // if(key === 'readonly') {
      //   return isReadonly
      // }
      if(key === ReactiveFlags.IS_READONLY){
        return isReadonly;
      }

      const res = Reflect.get(target, key);
      // 通过isReadonly判断是否收集依赖
      if(!isReadonly) {
        track(target, key);
      }

      return res;
    }
  }

  function createSetter() {
    return function set(target: Object, key: string, value: any) {
      const res = Reflect.set(target, key, value);

      trigger(target, key, value);

      return res;
    }
  }
```