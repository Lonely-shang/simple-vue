import { effect } from "../reactivity/effect"
import { isRef, proxyRef, ref, unRef } from "../reactivity/ref"

describe('ref', () => {

  it('happy path', () => {
    const a = ref(1)
    expect(a.value).toBe(1)
  })

  it('shoule be reactive', () => {
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


  it('isRef ', () => {
    const num = 1
    const a = ref(num)

    expect(isRef(num)).toBeFalsy()
    expect(isRef(a)).toBeTruthy()
  })

  it('unRef', () => {
    const num = 18
    const a = ref(num)

    expect(unRef(num)).toBe(18)
    expect(unRef(a)).toBe(18)
  })

  it('proxyRef', () => {

    const user = {
      name: 'Miliky',
      age: ref(18)
    }

    const proxyUser = proxyRef(user)

    expect(proxyUser.age).toBe(18)
    expect(user.age.value).toBe(18)
    expect(proxyUser.name).toBe('Miliky')

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

    proxyUser.age = ref(10);
    expect(proxyUser.age).toBe(10);
    expect(user.age.value).toBe(10);

  })
})