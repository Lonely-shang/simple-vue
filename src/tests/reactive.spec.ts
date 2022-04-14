import { isReactive, reactive } from "../reactivity/reactive"


describe('reactive', () => {

  it('happy', () => {

    const my = { name: 'Miliky'}

    const reactiveMy = reactive(my)

    expect(reactiveMy).not.toBe(my)

    expect(reactiveMy.name).toBe('Miliky')


  })

  it('isReactive', () => {

    const user = { age: 18, class: {
      english: 'English'
    }}

    const reactiveUser = reactive(user)

    expect(isReactive(user)).toBe(false)

    expect(isReactive(reactiveUser)).toBe(true)

    expect(isReactive(reactiveUser.class)).toBe(true)
  })

})