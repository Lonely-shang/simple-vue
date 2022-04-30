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


```
