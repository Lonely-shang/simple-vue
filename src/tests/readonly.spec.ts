import { isReadonly, readonly } from "../reactivity/reactive";

describe('readonly', () => {

  it('happy path', () => {

    console.warn = jest.fn();
    const original = { foo: 1, bar: { baz: 2 } }
    const wrapped = readonly(original)

    expect(original).not.toBe(wrapped)

    wrapped.bar = 2
    expect(console.warn).toBeCalled()

    expect(wrapped.foo).toBe(1)

  })

  it('isReadonly', () => {
    const original = { foo: 1, bar: { baz: 2 }}
    const wrapped = readonly(original)

    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped)).toBe(true)
  })

})