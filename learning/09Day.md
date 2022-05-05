##  proxyRefs

被`proxyRefs`包装的对象其内部的ref对象可以直接通过key获取内部的value的值，帮助结构ref

```typescript

  descript('ref', () => {
    it('proxyRefs', () => {
      
      const user = {
        name: 'Miliky',
        age: ref(18)
      }

      const proxyRefUser = proxyRefs(user);
      
      expect(proxyRefUser.age).toBe(18)
      expect(user.age.value).toBe(18)

      proxyRefUser.age = 20;
      expect(proxyRefUser.age).toBe(20)
      expect(user.age.value).toBe(20)

      proxyRefUser.age = ref(27);
      expect(proxyRefUser.age).toBe(27)
      expect(user.age.value).toBe(27)

    })
  })

```

```typescript
  // reactivity/ref.ts

  export function isRef (ref: Ref) {
    return !!ref.__v_isRef;
  }

  export function unRef(val: any) {
    return isRef(val) ? val.value : val;
  }

  export function proxyRefs(val: any) {
    return new Proxy(val, {
      get(target, key) {
        // 通过unRef函数判断时候返回ref包装的值
        return unRef(Reflect.get(target, key));
      },
      set(target, key, value) {

        // 如果`target[key]`是ref包装的值而value不是ref格式的则通过`.value`赋值
        if(isRef(target[key]) && isRef(value)){
          return target[key].value = value;
        }
        // 否则通过反射直接赋值
        return Reflect.set(target, key, value);
      }
    })
  }


```