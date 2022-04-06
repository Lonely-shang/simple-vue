import { effect } from "../reactivity/effect"
import { reactive } from "../reactivity/reactive"


describe('effect', () => {

  it('happy path', () => {

    const user = reactive({ age: 1 })

    let effectUser
    effect(() => {
      effectUser = user.age + 1
    })

    expect(effectUser).toBe(2)

    user.age++

    expect(effectUser).toBe(3)

  })


})